'use strict';

const GITHUB_API = 'https://api.github.com/';
const searchUser = document.querySelector('.searchUser');

class Github {
    constructor() {
        this.clientId = '0de3b6598274b65abad1';
        this.clientSecret = '73b31ba44820d771b36749185212c5a72161ec24';
    }

    // https://api.github.com/
    async getUser(userName) {
        const response = await fetch(`${GITHUB_API}users/${userName}?client_id=${this.clientId}&client_secret=${this.clientSecret}`);
        const user = await response.json();
        return user;
    }
    async getRepositories(userName) {
        const response = await fetch(`${GITHUB_API}users/${userName}/repos?per_page=5&sort=created:asc&client_id=${this.clientId}&client_secret=${this.clientSecret}`);
        const repos = await response.json();
        return repos.slice(0, 5);
    }
}

class UI {
    constructor() {
        this.profile = document.querySelector('.profile');
    }

    async showProfile(user) {
        this.profile.innerHTML = `
        <div class="card card-body mb-3">
            <div class="row">
                <div class="col-md-3">
                    <img class="img-fluid mb-2" src="${user.avatar_url}">
                    <a href="${user.html_url}" target="_blank" class="btn btn-primary btn-block mb-4">View Profile</a>
                </div>
                <div class="col-md-9">
                    <span class="badge badge-primary">Public Repos: ${user.public_repos}</span>
                    <span class="badge badge-secondary">Public Gists: ${user.public_gists}</span>
                    <span class="badge badge-success">Followers: ${user.followers}</span>
                    <span class="badge badge-info">Following: ${user.following}</span>
                    <br><br>
                    <ul class="list-group">
                        <li class="list-group-item">Company: ${user.company}</li>
                        <li class="list-group-item">Website/Blog: ${user.blog}</li>
                        <li class="list-group-item">Location: ${user.location}</li>
                        <li class="list-group-item">Member Since: ${user.created_at}</li>
                    </ul>
                </div>
            </div>
        </div>
        <h3 class="page-heading mb-3">Latest Repos</h3>
        <div class="repos"></div>
        `;
        try {
            const repos = await github.getRepositories(user.login)
        } catch (error) {
            console.error(error);
        }
    }

    async showRepositories(repos) {
        const reposDiv = document.createElement('div');

        repos.forEach(repo => {
            const repoDiv = document.createElement('div');
            repoDiv.classList.add('card', 'card-body', 'mb-3');
            repoDiv.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </div>
                <div class="col-md-6">
                    <span class="badge badge-warning">Stars:${repo.stargazers_count}</span>
                    <span class="badge badge-primary">Watchers:${repo.watchers_count}</span>
                    <span class="badge badge-success">Forks:${repo.forks_count}</span>
                </div>
            </div>
            `;
            reposDiv.append(repoDiv);
        });

        this.profile.querySelector('.repos').appendChild(reposDiv);
    }

    showAlert(message, className) {
        this.clearAlert();

        const div = document.createElement('div');
        div.className = className;
        div.innerHTML = message;

        const search = document.querySelector('.search');
        search.before(div);

        setTimeout(() => {
            this.clearAlert()
        }, 3000)
    }

    clearAlert() {
        const alert = document.querySelector('.alert');
        if (alert) {
            alert.remove();
        }
    }

    clearProfile() {
        this.profile.innerHTML = '';
    }

}

const github = new Github();
const ui = new UI();

function debounce(func, timeout = 1000) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}
async function showContent() {
    const userText = searchUser.value.trim();

    if (userText !== '') {
        try {
            const user = await github.getUser(userText);
            const repos = await github.getRepositories(userText);

            ui.showProfile(user);
            ui.showRepositories(repos);
        } catch (error) {
            ui.showAlert('User not found', 'alert alert-danger');
        }
    } else {
        ui.clearProfile();
    }
}

const processChange = debounce(() => showContent());

searchUser.addEventListener('keyup', processChange)

// // --------перший варіант)))--------
// let stillTyping;

// searchUser.addEventListener('keyup', function () {
//     clearTimeout(stillTyping);
//     stillTyping = setTimeout(showProfile, 800);
// });
// searchUser.addEventListener('keydown', function () {
//     clearTimeout(stillTyping);
// });

// async function showProfile() {
//     const userText = searchUser.value.trim();

//     if (userText !== '') {
//         try {
//             const user = await github.getUser(userText);
//             const repos = await github.getRepositories(userText);

//             ui.showProfile(user);
//             ui.showRepositories(repos);
//         } catch (error) {
//             ui.showAlert('User not found', 'alert alert-danger');
//         }
//     } else {
//         ui.clearProfile();
//     }
// }