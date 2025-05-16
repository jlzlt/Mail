document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Listen for when user sends email
  document.querySelector('#compose-form').addEventListener('submit', event => sendEmail(event));
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Get email from selected mailbox
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(result => {
    if (result.error) {
      alert(result.error);
    } else {
      console.log(result);
      populate_emails(result);
    }
    
  });
}

function sendEmail(event) {
  event.preventDefault();

  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    if (result.error) {
      alert(result.error); // Show server-provided error
    } else {
      load_mailbox('sent'); // Redirect only on success
    }
  })
  .catch(error => {
    console.error('Fetch error:', error);
    alert('A network error occurred.');
  });
}

function populate_emails(emails) {
  const emails_div = document.querySelector('#emails-view');

  const fragment = document.createDocumentFragment();

  emails.forEach(email => {
    let container = document.createElement('div');
    container.className = 'email-box';

    let senderEmail = document.createElement('span');
    senderEmail.className = 'sender-email';
    senderEmail.textContent = email.sender;

    let titleEmail = document.createElement('span');
    titleEmail.className = 'title-email';
    titleEmail.textContent = email.subject;

    let dateEmail = document.createElement('span');
    dateEmail.className = 'date-email';
    dateEmail.textContent = email.timestamp;

    if (email.read === true) {
      container.style.backgroundColor = '#F0F0F0';
      senderEmail.style.fontWeight = 'normal';
    }

    container.append(senderEmail);
    container.append(titleEmail);
    container.append(dateEmail);
    fragment.append(container);
  });

  emails_div.append(fragment);
}