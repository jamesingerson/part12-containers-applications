const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  const favourite = blogs.sort((a, b) => b.likes - a.likes)[0];
  return {
    title: favourite.title,
    author: favourite.author,
    likes: favourite.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  const blogCount = blogs.reduce((blogCount, post) => {
    // If blog count has content and already knows about the author, increase count by 1 for that author
    const currentAuthor =
      blogCount.length > 0 &&
      blogCount.find(({ author }) => author === post.author);
    if (currentAuthor) {
      currentAuthor.blogs += 1;
    }
    // Otherwise count for the author is one
    else blogCount.push({ author: post.author, blogs: 1 });
    return blogCount;
  }, []);
  // First entry once sorted by count of blogs
  return blogCount.sort((a, b) => b.blogs - a.blogs)[0];
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  const likedList = blogs.reduce((likedList, post) => {
    // If liked list has content and already knows about the author, sum likes for that author
    const currentAuthor =
      likedList.length > 0 &&
      likedList.find(({ author }) => author === post.author);
    if (currentAuthor) {
      currentAuthor.likes += post.likes;
    }
    // Otherwise sum for the author is that posts likes
    else likedList.push({ author: post.author, likes: post.likes });
    return likedList;
  }, []);
  // First entry once sorted by likes
  return likedList.sort((a, b) => b.likes - a.likes)[0];
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};
