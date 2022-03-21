import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.6.9/firebase-firestore-lite.js";
import { formatDistanceToNow } from "https://cdn.skypack.dev/date-fns";

const firebaseConfig = {
  apiKey: "AIzaSyACgBKFy7SZI6IW_ARvCwIEhYkMmb8UP58",
  authDomain: "radradio-11329.firebaseapp.com",
  projectId: "radradio-11329",
  storageBucket: "radradio-11329.appspot.com",
  messagingSenderId: "50631293869",
  appId: "1:50631293869:web:4b40fc9d65c69aa6777f24",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function formatDate(ts) {
  const date = ts.toDate();
  return formatDistanceToNow(date) + " ago";
}

// Get a list of cities from your database
async function getComments(db) {
  const commentsRef = collection(db, "comments");
  const q = await query(commentsRef, orderBy("timestamp", "desc"));
  const commentsSnapshot = await getDocs(q);
  // console.log(commentsSnapshot);

  const comments = commentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return comments;
}

function deleteComment(id) {
  const ok = confirm("Delete comment?");
  if (!ok) return;
  const commentRef = doc(db, "comments", id);
  deleteDoc(commentRef);
  const $comments = document.querySelector(".comments-list");
  $comments.innerHTML = "<p class='comments-loading'>Opnieuw laden...</p>";

  setTimeout(() => loadComments(), 1000);
}
// window.deleteComment = deleteComment;

async function loadComments() {
  const $comments = document.querySelector(".comments-list");
  $comments.innerHTML = "";
  try {
    const comments = await getComments(db);
    if (comments.length === 0) {
      $comments.innerHTML = "<p class='comments-loading'>Geen opmerkingen.</p>";
      return;
    }
    for (const comment of comments) {
      $comments.innerHTML += `
      <div class="comment" data-id="${comment.id}" style="cursor: not-allowed;">
      <div class="comment-date">${formatDate(comment.timestamp)}</div>
        <div class="comment-body">${comment.body}</div>
      </div>
    `;
    }
    Array.from(document.querySelectorAll(".comment")).forEach((el) => {
      el.addEventListener("click", () => deleteComment(el.dataset.id));
    });
  } catch (e) {
    console.error(e);
    $comments.innerHTML = "<p class='comments-loading'>Er ging iets mis met het laden van de opmerkingen.</p>";
  }
}

loadComments();
setInterval(loadComments, 60 * 1000);
