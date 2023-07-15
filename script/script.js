let comments = [];

const scrollToLatestComment = () => {
  const commentList = document.getElementById('comment-list');
  commentList.scrollTop = commentList.scrollHeight;
};

const displayComments = () => {
  const commentList = document.getElementById('comment-list');
  commentList.innerText = '';

  comments.forEach(comment => {
    const listItem = document.createElement('li');
    listItem.textContent = `${comment.content}\t${comment.timestamp}`;
    commentList.appendChild(listItem);
  });

  scrollToLatestComment();
};

const formatTimestamp = timestamp => {
  const hours = timestamp.getHours().toString().padStart(2, '0');
  const minutes = timestamp.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};


const addComment = event => {
  event.preventDefault();

  //const nameInput = document.getElementById('comment-name');
  const contentInput = document.getElementById('comment-input');

  const newComment = {
    content: contentInput.value,
    timestamp: formatTimestamp(new Date())
  };

  comments.push(newComment);
  displayComments();
  contentInput.value = '';
};

document.addEventListener('DOMContentLoaded', displayComments);
document.getElementById('comment-form').addEventListener('submit', addComment);
