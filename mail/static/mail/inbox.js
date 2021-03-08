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

  document.querySelector('form').onsubmit = () => {
 //get values for each element of the email
    let compose_recipients = document.querySelector('#compose-recipients').value;
    let compose_subject = document.querySelector('#compose-subject').value;
    let compose_body = document.querySelector('#compose-body').value;
  // post the email to the email db 
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: compose_recipients,
          subject: compose_subject,
          body: compose_body
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
    });
  }
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //Sent emails
  if (mailbox === "sent"){
    fetch('/emails/sent')
    .then(response => response.json())
    .then(email => {
    // Print email
    console.log(email);
      email.forEach(element => {
        let email_view = document.querySelector('#emails-view')
        let email_recipients = element.recipients;
        let email_subject = element.subject;
        let email_body = element.body;
          
        email_view.innerHTML += `<h2>${email_subject}</h2> <b1>${email_body}</b1></br>`;
        email_recipients.forEach(element => {
            email_view.innerHTML += `<h6>Recipient: ${element}</h6></br>`
          });
    });
   
});
  }
   //--------------------------------------------------------

   //inbox 
   if(mailbox == "inbox"){
    let email_view = document.querySelector('#emails-view')
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {
        // Print emails
        console.log(emails);
          emails.forEach(element => {
            let email_read = element.read;
            let email_timestamp = element.timestamp;
            let email_sender = element.sender;
            let email_subject = element.subject;
            let email_id = "email_id_"+ element.id;
            if (email_read) {
              //email has been read, needs a grey background
              email_view.innerHTML += `
              <div id=${email_id} style="border-style:groove; background-color: lightgray;">
              <h2>${email_subject}</h2>
              <b1>${email_sender}</b1></br>
              <b3>${email_timestamp}</b3>
              </div>
              </br>`;
            }
            else{
              //email has not been read needs a white background
              email_view.innerHTML += `
              <div id=${email_id} style="border-style:groove; ">
              <h2>${email_subject}</h2>
              <b1>${email_sender}</b1></br>
              <b3>${email_timestamp}</b3>
              </div>
              </br>`;
            }        
          });
          
            emails.forEach(element => {
              let email_id = element.id;
              let div_id = '#email_id_'+ email_id;
              document.querySelector(div_id).addEventListener('click', function(){
                fetch('/emails/' + email_id, {
                  method: 'PUT',
                  body: JSON.stringify({
                      read: true
                  })
                })
                email_view.innerHTML = " "
                email_view.innerHTML += `
                <div style="border-style:groove; background-color: lightgray; ">
                <h1>${element.subject}</h1>
                <h6>${element.sender}</h6>
                <h6>${element.timestamp}</h6>
                <b1>${element.body}</b1>
                </div>
                `;
                
              });
            });
    });
   }
}