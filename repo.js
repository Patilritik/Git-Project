const apiUrl = 'https://api.github.com';

async function getRepo  () {
    const username = document.getElementById('username').value;
    const loader = document.getElementById('loader');
    const repositoriesContainer = document.getElementById('repositories');
    const paginationContainer = document.getElementById('pagination');

    loader.style.display = 'block';
    repositoriesContainer.innerHTML = '';
    paginationContainer.innerHTML = '';

    try {
        const response = await fetch(`${apiUrl}/users/${username}/repos`);
        const repositories = await response.json();

        loader.style.display = 'none';
        
        if (repositories.message === "Not Found") {
            repositoriesContainer.innerHTML = '<h1 class="center">Wrong Username</h1>';
            return;
        }

        displayRepositories(repositories);
    } catch (error) {
        console.error('Error fetching repositories:', error);
        loader.style.display = 'none';
        repositoriesContainer.innerHTML = '<h3 class ="center" >An error occurred while fetching repositories</h3>';
    }
}

function displayRepositories(repositories) {
    const repositoriesContainer = document.getElementById('repositories');
    const paginationContainer = document.getElementById('pagination');

    const repositoriesPerPage = 10; // You can customize this
    const totalRepositories = repositories.length;
    const totalPages = Math.ceil(totalRepositories / repositoriesPerPage);

    let currentPage = 1;

    function showPage(page) {
        const start = (page - 1) * repositoriesPerPage;
        const end = start + repositoriesPerPage;
        const currentRepositories = repositories.slice(start, end);

        repositoriesContainer.innerHTML = currentRepositories.map(repo => `
            <div class="repository">
                
                <h2 > Repo Name : ${repo.name}</h2>
                <p>Description : ${repo.description || 'No description available'}</p>
                <p>Language: ${repo.language || 'Not specified'}</p>
                <p class ="curve-border">Topic :${repo.topics.join(', ') || ' No topics'}</p>
            </div>
        `).join('');

        // Pagination
        paginationContainer.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('a');
            pageLink.href = '#';
            pageLink.classList.add('page-link');
            pageLink.textContent = i;
            pageLink.onclick = () => showPage(i);
            paginationContainer.appendChild(pageLink);
        }
    }

    showPage(currentPage);
}
