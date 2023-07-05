
const prompt = document.getElementById("prompt")
  const form = document.querySelector('form');
  const chatContainer = document.querySelector('#chat_container');

  let loadInterval;

  function loader(element) {
    element.textContent = '';

    loadInterval = setInterval(() => {
      // Update the text content of the loading indicator
      element.textContent += '.';

      // If the loading indicator has reached three dots, reset it
      if (element.textContent === '....') {
        element.textContent = '';
      }
    }, 300);
  }

  function typeText(element, text) {
    let index = 0;

    let interval = setInterval(() => {
      if (index < text.length) {
        element.innerHTML += text.charAt(index);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);
  }

  // generate unique ID for each message div of bot
  // necessary for typing text effect for that specific reply
  // without unique ID, typing text will work on every element
  function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
  }

  function chatStripe(isAi, value, uniqueId) {
    return `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
          <span>${isAi ? '🤖' : '👱‍♂️'}</span>
          </div>
          <div class="message" id=${uniqueId}>${value}</div>
        </div>
      </div>
    `;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('wow'));

    // to clear the textarea input
    form.reset();

    // bot's chatstripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, ' ', uniqueId);

    // to focus scroll to the bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div
    const messageDiv = document.getElementById(uniqueId);

   
    // messageDiv.innerHTML = "..."
    loader(messageDiv);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.openai.com/v1/completions', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ');
    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        const responseData = JSON.parse(this.responseText);
        const completion = responseData.choices[0].text.trim();
  
        clearInterval(loadInterval);
        messageDiv.innerHTML = ' ';
        typeText(messageDiv, completion);
      }
    };
    xhr.send(
      JSON.stringify({
        model: 'text-davinci-003',
        prompt: `answers my questions base on this text "Wealth typically refers to the abundance of valuable resources or assets that an individual, organization, or country possesses. These resources can include money, property, investments, valuable possessions, and other forms of assets that can be used to generate income or increase their overall value over time.

        The accumulation of wealth can be a goal for many individuals and organizations, as it provides financial stability and can be used to fund future investments or lifestyle choices. However, wealth can also be a source of inequality and can create disparities in access to resources and opportunities."
        this is my question "${data.get('wow')}" give me only the answer`,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
      })
    );


    // clearInterval(loadInterval);
    // messageDiv.innerHTML = ' ';

    if (response.ok) {
      const data = await response.json();
      const parsedData = data.bot.trim(); // trims any trailing spaces/'\n'

      typeText(messageDiv, parsedData);
    } else {
      const err = await response.text();

      messageDiv.innerHTML = 'Something went wrong';
      alert(err);
    }
  };

  form.addEventListener('submit', handleSubmit);
  form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  });