class RatingWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
        <style>
        .star-rating {
            color : var(--unset-star-color, grey);
            font-size : 2rem;
        }
        .star-rating:hover {
            cursor : pointer;
        }
        button {
            display : none;
        }
        input {
            display : none;
        }
        </style>

        <form action="https://httpbin.org/post" method="POST">
            <input type="hidden" name="question" value="How satisfied are you?">
            <input type="hidden" name="sentBy" value="HTML">
            <input type="number" id="rating" name="rating" min="1" max="5" value="0" required>
            <button type="submit">Submit</button>
            <span class="star-rating" data-rating="1">&#x2605;</span>
            <span class="star-rating" data-rating="2">&#x2605;</span>
            <span class="star-rating" data-rating="3">&#x2605;</span>
            <span class="star-rating" data-rating="4">&#x2605;</span>
            <span class="star-rating" data-rating="5">&#x2605;</span>
        </form>`;
        this.message = document.createElement('p');
        this.shadowRoot.appendChild(this.message);
    }
    
    connectedCallback() {
        this.formBehavior();
        this.starBehavior();
    }

    starBehavior() {
        const stars = this.shadowRoot.querySelectorAll(".star-rating");
        const rating = this.shadowRoot.getElementById("rating");

        stars.forEach(element => {
            element.addEventListener('mouseover', function() {
                for(let i = element.dataset.rating - 1; i >= 0; i--) {
                    stars[i].style.color = getCSSVar("--set-star-color");
                }
            });
            element.addEventListener('mouseout', function() {
                for(let i = element.dataset.rating - 1; i >= 0; i--) {
                    stars[i].style.color = getCSSVar("--unset-star-color");
                }
            });
            element.addEventListener('click', () => {
                rating.value = element.dataset.rating;
                const ratingSetEvent = new CustomEvent('rating-set', {bubbles : true});
                rating.dispatchEvent(ratingSetEvent);
                for(let i = 4; i >= 0; i--) {
                    stars[i].style = "display : none";
                }
                this.displayMessage(element.dataset.rating);
            });
        });
    }

    formBehavior() {
        const rating = this.shadowRoot.getElementById("rating");
        const myForm = this.shadowRoot.querySelector("form");
        const submitButton = this.shadowRoot.querySelector("button");

        myForm.addEventListener("submit", function(event) {
            event.preventDefault();
            // Prepare FormData from the form
            let formData = new FormData(this);
            // Create a new XMLHttpRequest
            let xhr = new XMLHttpRequest();
            // Set up the request
            xhr.open('POST', 'https://httpbin.org/post', true);
            // set a fun header
            xhr.setRequestHeader('X-Sent-By', 'JS');
            // Set up a function to handle the response
            xhr.onload = function() {
                if(xhr.status === 200) {
                    // On success, display the response to the console
                     console.log(xhr.responseText);
                }
                else {
                    console.error('Error:', xhr.statusText);
                }
            };
            // Handle network errors
		xhr.onerror = function() {
			console.error('Network Error');
		};
		// Send the request
		xhr.send(formData);
        });

        rating.addEventListener("rating-set", function() {
            submitButton.click();
        });
    }

    displayMessage(rating) {
        if(rating < 4) {
            this.message.textContent = "Thanks for your feedback of " + rating + " stars. We'll try to do better!";
        }
        else {
            this.message.textContent = "Thanks for " + rating + " star rating!";
        }
    }
}
customElements.define('rating-widget', RatingWidget);

function getCSSVar(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName);
}