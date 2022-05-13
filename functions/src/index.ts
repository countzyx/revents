import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import type {
  EventInfo,
  NewsFeedPost,
  NewsFeedPostCode,
  UserBasicInfo,
  UserProfile,
} from './Shared/Types';
import { getDateTimeStringFromDate, WithIdDataConverter } from './Shared/Utils';

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
// eslint-disable-next-line new-cap
const userBasicInfoDataConverter = WithIdDataConverter<UserBasicInfo>();

const kEventPath = 'events/{eventId}';
const kEventsCollection = 'events';
const kFollowersCollection = 'followers';
const kFollowingCollection = 'following';
const kRelationshipsCollection = 'relationships';
const kRelationshipsFollowingPath = 'relationships/{userId}/following/{profileId}';
const kUsersCollection = 'users';
const kUserProfilePath = 'users/{userId}';

const eventsCollection = db.collection(kEventsCollection);
const relationshipsCollection = db.collection(kRelationshipsCollection);
const userCollection = db.collection(kUsersCollection);

export const createFollowerOnCreateFollowing = functions.firestore
  .document(kRelationshipsFollowingPath)
  .onCreate(async (snap, context) => {
    const following = snap.data();
    console.log(following);
    try {
      const { profileId, userId } = context.params as { profileId: string; userId: string };
      const userDoc = await userCollection.doc(userId).get();
      if (!userDoc.exists) return console.log(`User ${userId} does not exist.`);
      const userInfo = userDoc.data() as UserProfile;
      if (!userInfo) return console.log(`User ${userId} is undefined.`);
      const { displayName, photoURL } = userInfo;
      const batch = db.batch();
      batch.set(
        relationshipsCollection.doc(profileId).collection(kFollowersCollection).doc(userId),
        {
          id: userDoc.id,
          displayName,
          photoURL,
        },
      );
      batch.update(userCollection.doc(profileId), {
        followerCount: admin.firestore.FieldValue.increment(1),
      });
      return await batch.commit();
    } catch (err) {
      return console.log(err);
    }
  });

export const createNewsFeedPostOnUpdateEvent = functions.firestore
  .document(kEventPath)
  .onUpdate(async (snap, context) => {
    const eventId = context.params.eventId as string;
    if (!eventId) return console.log('eventId is undefined');

    const beforeData = snap.before.data() as EventInfo;
    if (!beforeData || !beforeData.attendees)
      return console.log(`Before update event info or its attendees are undefined for ${eventId}`);

    const afterData = snap.after.data() as EventInfo;
    if (!afterData || !afterData.attendees)
      return console.log(`After update event info or its attendees are undefined for ${eventId}`);

    if (beforeData.attendees.length < afterData.attendees.length) {
      const addedAttendee = afterData.attendees.filter(
        // That beforeData.attendees is defined is not being picked up properly.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (aftAtt) => !beforeData.attendees!.some((befAtt) => befAtt.id === aftAtt.id),
      )[0];
      const post = makeEventsNewsFeedPost(addedAttendee, 'joined-event', afterData, eventId);
      console.log('post', JSON.stringify(post));
      try {
        const followerDocs = await db
          .collection(kRelationshipsCollection)
          .doc(addedAttendee.id)
          .collection(kFollowersCollection)
          .get();
        followerDocs.forEach((follower) => {
          admin.database().ref(`/newsfeed/${follower.id}`).push(post);
        });
        return console.log(`notified followers of ${JSON.stringify(addedAttendee)}`);
      } catch (err) {
        return console.log(err);
      }
    } else if (beforeData.attendees.length > afterData.attendees.length) {
      const removedAttendee = beforeData.attendees.filter(
        // That beforeData.attendees is defined is not being picked up properly.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (befAtt) => !afterData.attendees!.some((aftAtt) => befAtt.id === aftAtt.id),
      )[0];
      const post = makeEventsNewsFeedPost(removedAttendee, 'left-event', afterData, eventId);
      console.log('post', JSON.stringify(post));
      try {
        const followerDocs = await db
          .collection(kRelationshipsCollection)
          .doc(removedAttendee.id)
          .collection(kFollowersCollection)
          .get();
        followerDocs.forEach((follower) => {
          admin.database().ref(`/newsfeed/${follower.id}`).push(post);
        });
        return console.log(`notified followers of ${JSON.stringify(removedAttendee)}`);
      } catch (err) {
        return console.log(err);
      }
    }
  });

export const deleteFollowerOnDeleteFollowing = functions.firestore
  .document(kRelationshipsFollowingPath)
  .onDelete(async (snap, context) => {
    try {
      const batch = db.batch();
      const { profileId, userId } = context.params as { profileId: string; userId: string };
      batch.delete(
        relationshipsCollection.doc(profileId).collection(kFollowersCollection).doc(userId),
      );
      batch.update(userCollection.doc(profileId), {
        followerCount: admin.firestore.FieldValue.increment(-1),
      });

      return await batch.commit();
    } catch (err) {
      return console.log(err);
    }
  });

export const updateUserPhotoOnUpdateProfilePhoto = functions.firestore
  .document(kUserProfilePath)
  .onUpdate(async (snap, context) => {
    const userId = context.params.userId as string;
    if (!userId) return console.log('userId is undefined');

    const beforeData = snap.before.data() as UserProfile;
    if (!beforeData) return console.log(`Before update profile is undefined for ${userId}`);

    const afterData = snap.after.data() as UserProfile;
    if (!afterData) return console.log(`After update profile is undefined for ${userId}`);

    if (beforeData.photoURL === afterData.photoURL)
      return console.log('user profile photo did not change.');

    const { photoURL } = afterData;
    if (!photoURL) return console.log(`user ${userId} profile photo undefined`);

    try {
      const batch = db.batch();
      // Update the user photo in all upcoming events.
      const now = getDateTimeStringFromDate(new Date()); // we are storing dates as strings
      const eventDocsSnap = await eventsCollection
        .where('attendeeIds', 'array-contains', userId)
        .where('date', '>=', now)
        .get();
      eventDocsSnap.forEach((eventDoc) => {
        const event = eventDoc.data() as EventInfo;

        // Update the host photo if user is hosting.
        if (event.hostUid === userId) {
          batch.update(eventDoc.ref, { hostPhotoURL: photoURL });
        }

        // Update attendee photo if user is attending event.
        const updatedAttendees =
          event.attendees &&
          event.attendees.map((a) => ({
            ...a,
            photoURL: a.id === userId ? photoURL : a.photoURL,
          }));
        updatedAttendees &&
          batch.update(eventDoc.ref, {
            attendees: updatedAttendees,
          });
      });

      // Update the user photo in the relationships for all the people the user follows.
      const userFollowingDocsSnap = await relationshipsCollection
        .doc(userId)
        .collection(kFollowingCollection)
        .withConverter(userBasicInfoDataConverter)
        .get();
      userFollowingDocsSnap.forEach((followedInfoRef) => {
        const userFollowerDocRef = relationshipsCollection
          .doc(followedInfoRef.id)
          .collection(kFollowersCollection)
          .doc(userId);
        batch.update(userFollowerDocRef, { photoURL });
      });

      return await batch.commit();
    } catch (err) {
      return console.log(err);
    }
  });

const makeEventsNewsFeedPost = (
  attendee: UserBasicInfo,
  code: NewsFeedPostCode,
  event: EventInfo,
  eventId: string, // event ID is usually the key for the event doc, so is not returned in the doc
): NewsFeedPost => {
  const { displayName, id, photoURL } = attendee;
  return {
    code,
    date: admin.database.ServerValue.TIMESTAMP,
    displayName,
    eventId: event.id || eventId,
    eventTitle: event.title,
    photoURL,
    userId: id,
  };
};
