const test_button = document.getElementById('test_button');
console.log('test_button:', test_button);
if (test_button) {
  test_button.addEventListener('click', async () => {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> click test_button <<<<<<<<<<<<<<<<<<<<<<<<<<');
    alert('test button');
  },
  );
}

const test_link = document.getElementById('web3auth_signin_link');
console.log('test_link:', test_link);
if (test_link) {
  test_link.addEventListener('click', async () => {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> click test_link <<<<<<<<<<<<<<<<<<<<<<<<<<');
    alert('test_link');
  },
  );
}
