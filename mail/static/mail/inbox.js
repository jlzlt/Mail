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
  document.querySelector('#email-view').style.display = 'none';
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
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';

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
    const container = document.createElement('div');
    container.className = 'email-box';
    container.onclick = () => load_email(email.id);

    const senderEmail = document.createElement('span');
    senderEmail.className = 'sender-email';
    senderEmail.textContent = email.sender;

    const titleEmail = document.createElement('span');
    titleEmail.className = 'title-email';
    titleEmail.textContent = email.subject;

    const dateEmail = document.createElement('span');
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

function load_email(email_id) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';

  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
    if (email.error) {
      alert(result.error);
    } else {
      console.log(email);
      mark_read(email.id);
      email.read = true;
      open_email(email);
    }    
  })
}

function mark_read(email_id) {
  // Mark email as read
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })
}

function open_email(email) { 
  const emailDiv = document.querySelector('#email-view');
  const fragment = document.createDocumentFragment();

  const from = document.createElement('p');
  from.className = 'email-labels';
  from.textContent = 'From: ';

  const fromEmail = document.createElement('span');
  fromEmail.className = 'email-content';
  fromEmail.textContent = email.sender;
  from.append(fromEmail);

  const to = document.createElement('p');
  to.className = 'email-labels';
  to.textContent = 'To: ';

  const toEmail = document.createElement('span');
  toEmail.className = 'email-content';
  toEmail.textContent = email.recipients.join(', ');
  to.append(toEmail);

  const subject = document.createElement('p');
  subject.className = 'email-labels';
  subject.textContent = 'Subject: ';

  const subjectText = document.createElement('span');
  subjectText.className = 'email-content';
  subjectText.textContent = email.subject;
  subject.append(subjectText);

  const timestamp = document.createElement('p');
  timestamp.className = 'email-labels';
  timestamp.textContent = 'Timestamp: ';

  const timestampText = document.createElement('span');
  timestampText.className = 'email-content';
  timestampText.textContent = email.timestamp;
  timestamp.append(timestampText);

  const replyBtn = document.createElement('button');
  replyBtn.className = 'btn btn-sm btn-outline-primary';
  replyBtn.textContent = 'Reply';
  replyBtn.addEventListener('click', () => reply_email(email));

  const archiveBtn  = document.createElement('button');
  archiveBtn.className = 'btn btn-sm btn-outline-primary ml-1 archive-btn';
  archiveBtn.textContent = email.archived ? 'Unarchive' : 'Archive';    
  archiveBtn.addEventListener('click', () => toggle_props(email.id, 'archived'));

  const readBtn = document.createElement('button');
  readBtn.className = 'btn btn-sm btn-outline-primary ml-1 read-btn';
  readBtn.textContent = email.read ? 'Mark as Unread' : "Mark as Read";
  readBtn.addEventListener('click', () => toggle_props(email.id, 'read'));
  
  const separator = document.createElement('hr');

  const body = document.createElement('p');
  body.textContent = email.body;

  fragment.append(from);
  fragment.append(to);
  fragment.append(subject);
  fragment.append(timestamp);
  fragment.append(replyBtn);
  fragment.append(archiveBtn);
  fragment.append(readBtn);
  fragment.append(separator);
  fragment.append(body);

  emailDiv.innerHTML = '';
  emailDiv.append(fragment);
}

function toggle_props(email_id, prop) {
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
    if (email.error) {
      alert(result.error);
    } else {
      if (email[prop] === true) {
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            [prop]: false
          })
        })
        .then(() => {
          if (prop === 'archived') {
            load_mailbox('inbox');
          } else if (prop === 'read') {
            document.querySelector('.read-btn').textContent = 'Mark as Read';
          }
        });         
      } else if (email[prop] === false) {
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            [prop]: true
          })
        })
        .then(() => {
          if (prop === 'archived') {
            load_mailbox('inbox');
          } else if (prop === 'read') {
            document.querySelector('.read-btn').textContent = 'Mark as Unread';
          }
        })
      } 
    }    
  })
}

function reply_email(email) {
  compose_email()
  document.querySelector('#compose-recipients').value = email.sender;
  document.querySelector('#compose-subject').value = 
    email.subject.startsWith('Re: ') ? email.subject : `Re: ${email.subject}`;
  document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: \n${email.body}`;
}