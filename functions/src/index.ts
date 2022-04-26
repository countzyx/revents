import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
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
      const userInfo = userDoc.data();
      if (!userInfo) return console.log(`User ${userId} is undefined.`);
      const { displayName, photoURL } = userInfo;
      const batch = db.batch();
      batch.set(relationshipsCollection.doc(profileId).collection('followers').doc(userId), {
        id: userDoc.id,
        displayName,
        photoURL,
      });
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
      batch.delete(relationshipsCollection.doc(profileId).collection('followers').doc(userId));
      batch.update(userCollection.doc(profileId), {
        followerCount: admin.firestore.FieldValue.increment(-1),
      });

      return await batch.commit();
    } catch (err) {
      return console.log(err);
    }
  });
