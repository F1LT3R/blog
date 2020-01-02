/*
        <span class="post-tags">
          {% for tag in post.tags limit:1 %}
          <span class="post-tag"><a href="/search.html?term={{ tag }}">{{ tag }}</a></span>
          {% endfor %}
          
          {% for tag in post.tags limit:1 offset:2 %}
          <span class="post-tag"><a href="/search.html?term={{ tag }}">{{ tag }}</a></span>
          {% endfor %}
        </span>
*/

(function() {
  const tagsTemplate = tags => {
    let tagsOutput = '';
    const limit = 2;

    const lastTag = tags[limit];
    tags = tags.slice(0, limit);

    tags.forEach((tag, index) => {
        tagsOutput += `<span class="post-tag"><a href="/search.html?term=${tag}">${tag}</a></span>`
    });
    tagsOutput += `<span class="post-tag"><a href="/search.html?term=${lastTag}">${lastTag}</a></span>`

    return `<span class="post-tags">${tagsOutput}</span>`;
  }

  const postTemplate = post => `<li>
    <div class="post-item-head">
      <h3>
        <a class="post-link" href="${post.url}">
          ${post.title}
        </a>
      </h3>
      
      <div class="post-image">
        <a href="${post.url}">
          <div class="img" style="background-image: url('${post.feature_img}')"></div>
        </a>
      </div>
            
      <span class="post-meta">
        <span class="post-tags">
          ${tagsTemplate(post.tags)}
        </tag>

        <span class="post-date">
          ${post.date}
        </span>
      </span>

      <div class="excerpt">${post.content.slice(0, 150)}</div>
  </li>`;

  function displaySearchResults(results, store, searchTerm) {
    var searchResults = document.getElementById('search-results');
    var $searchTerm = document.getElementById('search-term');
    var $searchResultCount = document.getElementById('search-results-count');
    
    $searchTerm.innerHTML = searchTerm;
    $searchResultCount.innerHTML = results.length;

    if (results.length) {
      var appendString = '<ul class="post-list">';

      for (var i = 0; i < results.length; i++) {  // Iterate over the results
        var item = store[results[i].ref];
        // appendString += '<li><a href="' + item.url + '"><h3>' + item.title + '</h3></a>';
        // appendString += '<img src="' + item.feature_img + '" class="search-img"/>'
        // appendString += '<p>' + item.content.substring(0, 150) + '...</p></li>';

        appendString += postTemplate(item);
      }
      appendString += '</ul>';

      searchResults.innerHTML = appendString;
    }
  }

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }

  var searchTerm = getQueryVariable('term');

  if (searchTerm) {
    document.getElementById('search-box').setAttribute("value", searchTerm);

    // Initalize lunr with the fields it will be searching on. I've given title
    // a boost of 10 to indicate matches on this field are more important.
    var idx = lunr(function () {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('author');
      this.field('category');
      this.field('content');
    });

    for (var key in window.store) { // Add the data to lunr
      idx.add({
        'id': key,
        'title': window.store[key].title,
        'author': window.store[key].author,
        'category': window.store[key].category,
        'content': window.store[key].content
      });

      var results = idx.search(searchTerm); // Get lunr to perform a search
      displaySearchResults(results, window.store, searchTerm); // We'll write this in the next section
    }
  }
})();
