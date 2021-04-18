/*
You are going to build a JavaScript application which searches GitHub for users by name and displays the results on the screen. Clicking on a specific user will show all the repositories for that user.

1. When the form is submitted, it should take the value of the input and search GitHub for user matches using the User Search Endpoint.

2. Using the results of the search, display information about the users to the page. (You might include showing their username, avatar and a link to their profile.)

3. Clicking on one of these users should send a request to the User Repos Endpoint and return data about all the repositories for that user.Using the response from the Users Repos Endpoint, display all the repositories for that user on the page.
*/

// Issue #1: Submitting the form -> Shows all users that match input 

document.addEventListener('DOMContentLoaded', () => {
    // Grab values from input form 
    const submissionForm = document.getElementById('github-form');

    submissionForm.addEventListener('submit', (e, ) => {

        //Prevents the page from submitting
        e.preventDefault();
        // Clears the value in the input box
        

        // Removes Previous List 
        const userListUl = document.getElementById('user-list');
        const previousliList = Array.from(userListUl.getElementsByTagName('li'));
        previousliList.forEach((li) => {
            li.remove();
        })

        const searchKeyword = document.getElementById('search').value; 
        
        // Submit a request using the input form data 
        let configObj = {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Accept": "application/vnd.github.v3+json"
            },
        };
        fetch(`https://api.github.com/search/users?q=${searchKeyword}`, configObj)
            .then(res => res.json())
            .then(data => {
                displaySearch(data)
            })


        document.getElementById('search').value = ' ';

        
    })

    


})


// Display the data given on the page 
function displaySearch(data) {
    const resultUsersObj = data.items ;

    for (let i = 0; resultUsersObj.length > i; i++ ){
        const user = resultUsersObj[i];
        const userLogin = user.login;
        const userAvatar = user.avatar_url;
        const userProfileUrl = user.html_url;

        const userListUl = document.getElementById('user-list');

        // Creating Elements to display 
        const createLi = document.createElement('li');
        const createImg = document.createElement('img');
        const createButton = document.createElement('button');

        function createAnchor(innerText, url){
            const anchor = document.createElement('a');
            anchor.innerText = `${innerText}'s profile`;
            anchor.setAttribute('href', url);
            anchor.setAttribute('target', '_blank');
            anchor.style.display = 'block';
            
            return anchor;
        }

        function setAnAtrribute(element, arrayAttributes, arrayValues){
            for (let i = 0; arrayAttributes.length > i; i++){
                element.setAttribute(arrayAttributes[i], arrayValues[i])
            }
        }

        // Setting image attributes to include image and some styling 
        setAnAtrribute(createImg, ['src', 'width', 'height'], [userAvatar, '128px', '128px'])
 
        // Setting Button to  show repos when clicked 
        createButton.setAttribute('class', `${userLogin}`);
        createButton.innerText = `View ${userLogin}'s Repository`;
        createButton.style.display = 'block';

        createLi.appendChild(createImg);
        createLi.appendChild(createAnchor(userLogin, userProfileUrl));
        createLi.appendChild(createButton);
        userListUl.appendChild(createLi);
        
        createButton.addEventListener('click', (e) => {
            e.preventDefault();

            const repoUl = document.getElementById('repos-list');
            const repoLi = Array.from(repoUl.getElementsByTagName('li'));

            repoLi.forEach(li => {
                li.remove()
            })
            repoUl.innerText = `${userLogin} Repos: `
            fetch(`https://api.github.com/users/${userLogin}/repos`)
            .then(res => res.json())
            .then(data => displayRepos(data))


        })
        
    }
}

function displayRepos(data){
    data.forEach(repo => {
        const repoUl = document.getElementById('repos-list');
        const createLi = document.createElement('li');
        
        createLi.innerText = repo.name;

        repoUl.appendChild(createLi);
    })
}














