// Functions for index.html
function loadStoryList() {
    fetch('stories.json')
        .then(response => response.json())
        .then(stories => {
            const storiesSection = document.getElementById('stories');
            storiesSection.innerHTML = ''; // Clear existing content
            stories.forEach(story => {
                const storyDiv = document.createElement('div');
                storyDiv.className = 'story-block';
                storyDiv.innerHTML = `
                    <button class="share-btn" onclick="shareOptions('${story.title}', 'story.html?id=${story.id}')">Share</button>
                    <h3 class="story-title">${story.title}</h3>
                    <p class="story-highlight">${story.highlight}</p>
                    <p class="story-info">Publish Date <span class="publish-date">${story.date}</span></p>
                    <a href="story.html?id=${story.id}" class="read-more">Read More</a>
                `;
                storiesSection.appendChild(storyDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching stories:', error);
        });
}

// Functions for story.html
function loadStoryContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const storyId = urlParams.get('id');
    const storyContentElement = document.getElementById('story-content');

    if (storyId && storyContentElement) {
        fetch('stories.json')
            .then(response => response.json())
            .then(stories => {
                const story = stories.find(s => s.id === storyId);
                if (story) {
                    document.getElementById('story-heading').innerText = story.title;
                    const storyFilename = story.title.toLowerCase().replace(/ /g, '-') + '.txt';
                    return fetch(`stories/${storyFilename}`);
                } else {
                    throw new Error('Story not found.');
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.text();
            })
            .then(text => {
                storyContentElement.innerText = text;
            })
            .catch(error => {
                storyContentElement.innerText = 'Failed to load story content.';
                console.error('Error:', error);
            });
    } else if (storyContentElement) {
        storyContentElement.innerText = 'No story selected.';
    }
}

// Shared function
function shareOptions(title, path) {
    const fullUrl = `${window.location.origin}/${path}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
        alert('Link copied to clipboard!');
    }, () => {
        alert('Failed to copy link.');
    });
}

// Check which page we're on and call the appropriate function
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('stories')) {
        loadStoryList();
    } else if (document.getElementById('story-content')) {
        loadStoryContent();
    }
});
