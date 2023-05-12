document.addEventListener("DOMContentLoaded", function() {
  const button = document.querySelector('button');
  const message = document.querySelector('.message');
  const input = document.querySelector('input');
  const cooldownTime = 10000;
  let cooldownEnd = localStorage.getItem('cooldownEnd');
  let cooldownActive = false;

  button.addEventListener('click', async function() {
    if (cooldownEnd && Date.now() < cooldownEnd) {
      const timeLeft = Math.ceil((cooldownEnd - Date.now()) / 1000);
      if (timeLeft > 0) {
        message.textContent = `Cooldown is active, please wait ${timeLeft} seconds...`;
        const countdownInterval = setInterval(() => {
          const newTimeLeft = Math.ceil((cooldownEnd - Date.now()) / 1000);
          if (newTimeLeft <= 0) {
            clearInterval(countdownInterval);
            message.textContent = 'Cooldown is over, you can check the username.';
          } else {
            message.textContent = `Cooldown is active, please wait ${newTimeLeft} seconds...`;
          }
        }, 1000);
        return;
      }
    }

    let username = input.value.trim().toLowerCase();
    if (username === "") {
      message.textContent = "Username can't be empty.";
      return;
    }

    try {
      button.disabled = true;
      cooldownActive = true;
      cooldownEnd = Date.now() + cooldownTime;
      localStorage.setItem('cooldownEnd', cooldownEnd);
      setTimeout(() => {
        cooldownActive = false;
        localStorage.removeItem('cooldownEnd');
      }, cooldownTime);
      const response = await fetch(`https://api.lixqa.de/v2/discord/pomelo-lookup/?username=${username}`); /* do you want an endpoint? you won't get :3 */
      const data = await response.json();
      const messageText = data.message;
      if (messageText === "Available") {
        message.textContent = `Your username "${username}" is `;
        const availableText = document.createElement('span');
        availableText.textContent = "available.";
        availableText.classList.add('available');
        message.appendChild(availableText);
      } else if (messageText === "Taken") {
        message.textContent = `Your username "${username}" is `;
        const takenText = document.createElement('span');
        takenText.textContent = "taken.";
        takenText.classList.add('taken');
        message.appendChild(takenText);
      } else if (messageText === "Username can only use letters, numbers, underscores and full stops.") {
        message.textContent = "Username can only use letters, numbers, underscores and full stops.";
      } else if (messageText === "Must be between 2 and 32 in length.") {
        message.textContent = "Username must be between 2 and 32 in length.";
      } else if (messageText === "Username cannot contain \"discord\"") {
        message.textContent = "Username cannot contain discord.";
      } else {
        message.textContent = "API error, please try again.";
      }
    } catch (error) {
      console.log(error);
      message.textContent = "Data download error, please try again.";
    } finally {
      button.disabled = false;
    }
  });
});
