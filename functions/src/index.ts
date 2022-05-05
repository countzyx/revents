import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import type {
  EventInfo,
  NewsFeedPost,
  NewsFeedPostCode,
  UserBasicInfo,
  UserProfile,
} from './Shared/Types';

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const kEventPath = 'events/{eventId}';
const kFollowersCollection = 'followers';
const kRelationshipsCollection = 'relationships';
const kRelationshipsFollowingPath = 'relationships/{userId}/following/{profileId}';
const relationshipsCollection = db.collection('relationships');
const userCollection = db.collection('users');

export const createFollowerOnCreateFollowing = functions.firestore
  .document(kRelationshipsFollowingPath)
  .onCreate(async (snap, context) => {
    const following = snap.data();
    console.log(following);
    try {
      const { profileId, userId } = context.params;
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

export const deleteFollowerOnDeleteFollowing = functions.firestore
  .document(kRelationshipsFollowingPath)
  .onDelete(async (snap, context) => {
    try {
      const batch = db.batch();
      const { profileId, userId } = context.params;
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

export const createNewsFeedPostOnUpdateEvent = functions.firestore
  .document(kEventPath)
  .onUpdate(async (snap, context) => {
    const beforeData = snap.before.data() as EventInfo;
    if (!beforeData || !beforeData.attendees)
      return console.log('Before update event info or its attendees are undefined');

    const afterData = snap.after.data() as EventInfo;
    if (!afterData || !afterData.attendees)
      return console.log('After update event info or its attendees are undefined');

    if (beforeData.attendees.length < afterData.attendees.length) {
      const addedAttendee = afterData.attendees.filter(
        // That beforeData.attendees is defined is not being picked up properly.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (aftAtt) => !beforeData.attendees!.some((befAtt) => befAtt.id === aftAtt.id),
      )[0];
      console.log(`added ${addedAttendee} to event ${context.params.eventId}`);
      try {
        const followerDocs = await db
          .collection(kRelationshipsCollection)
          .doc(addedAttendee.id)
          .collection(kFollowersCollection)
          .get();
        followerDocs.forEach((follower) => {
          admin
            .database()
            .ref(`/newsfeed/${follower.id}`)
            .push(makeEventsNewsFeedPost(addedAttendee, 'joined-event', context.params.eventId));
        });
        return console.log(`notified followers of ${addedAttendee}`);
      } catch (err) {
        return console.log(err);
      }
    } else if (beforeData.attendees.length > afterData.attendees.length) {
      const removedAttendee = beforeData.attendees.filter(
        // That beforeData.attendees is defined is not being picked up properly.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (befAtt) => !afterData.attendees!.some((aftAtt) => befAtt.id === aftAtt.id),
      )[0];
      console.log(`removed ${removedAttendee} from event ${context.params.eventId}`);
      try {
        const followerDocs = await db
          .collection(kRelationshipsCollection)
          .doc(removedAttendee.id)
          .collection(kFollowersCollection)
          .get();
        followerDocs.forEach((follower) => {
          admin
            .database()
            .ref(`/newsfeed/${follower.id}`)
            .push(makeEventsNewsFeedPost(removedAttendee, 'left-event', context.params.eventId));
        });
        return console.log(`notified followers of ${removedAttendee}`);
      } catch (err) {
        return console.log(err);
      }
    }
  });

const makeEventsNewsFeedPost = (
  attendee: UserBasicInfo,
  code: NewsFeedPostCode,
  eventId: string,
): NewsFeedPost => {
  const { displayName, id, photoURL } = attendee;
  return {
    code,
    date: admin.database.ServerValue.TIMESTAMP,
    displayName,
    eventId,
    photoURL,
    userId: id,
  };
};
