const wrapper = document.querySelector('.sliderWrapper');

const menuItems = document.querySelectorAll('.menuItem');

const products = [
  {
    id: 1,
    title: 'ROADSTER',
    price: 119,
    colors: [
      {
        code: 'black',
        img: './Roadster.png',
      },
    ],
  },
  {
    id: 2,
    title: 'MODA RAPIDO',
    price: 149,
    colors: [
      {
        code: 'lightgray',
        img: './Moda_Rapido.png',
      },
    ],
  },
  {
    id: 3,
    title: 'HRX',
    price: 109,
    colors: [
      {
        code: 'lightgray',
        img: './HRX.png',
      },
    ],
  },
  {
    id: 4,
    title: 'GUCCI',
    price: 129,
    colors: [
      {
        code: 'black',
        img: './Gucci.png',
      },
    ],
  },
  {
    id: 5,
    title: 'PRADA',
    price: 99,
    colors: [
      {
        code: 'gray',
        img: './img/hippie.png',
      },
      {
        code: 'black',
        img: './img/hippie2.png',
      },
    ],
  },
];

let chosenProduct = products[0];

const currentProductImg = document.querySelector('.productImage');
const currentProductTitle = document.querySelector('.productTitle');
const currentProductPrice = document.querySelector('.productPrice');
const currentProductColors = document.querySelectorAll('.color');
const currentProductSizes = document.querySelectorAll('.size');
const myImageElement = document.getElementById('adBanner');
const myImageElementWithPartitioned = document.getElementById('adBannerWithPartitioned');

//reload ad banner
setInterval(function() {
  var time = new Date().getMilliseconds();
  myImageElement.src = `https://54.226.245.143.nip.io/api/get-personalized-ads?${time}`;
  myImageElementWithPartitioned.src = `https://3.91.29.6.nip.io/api/get-personalized-ads?${time}`;
}, 2000);

//sendXHRcalls for the 3rd party server
function trackUserInteraction(productViewed) {

  const userInteractionData = {
    pageViewed: document.title,
    productName: productViewed,
    timestamp: new Date()
  };
  const uri = 'https://54.226.245.143.nip.io/api/track-user-behavior';
  // Send the data to the Advertisement Site via an API call
  fetch(uri, {
    method: 'POST',
    mode: 'cors',
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInteractionData),
  }).then(response => {
    if (response.ok) {
      console.log('User interaction data sent successfully.');
    } else {
      console.error('Failed to send user interaction data.');
    }
  }).catch(error => {
    console.error('Error sending user interaction data: ' + error);
  });
}

//sendXHRcalls for the 3rd party server
function trackUserInteractionWithPartitionedAdServer(productViewed) {

  const userInteractionData = {
    pageViewed: document.title,
    productName: productViewed,
    timestamp: new Date()
  };
  const uri = 'https://3.91.29.6.nip.io/api/track-user-behavior';
  // Send the data to the Advertisement Site via an API call
  fetch(uri, {
    method: 'POST',
    mode: 'cors',
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInteractionData),
  }).then(response => {
    if (response.ok) {
      console.log('User interaction data sent successfully.');
    } else {
      console.error('Failed to send user interaction data.');
    }
  }).catch(error => {
    console.error('Error sending user interaction data: ' + error);
  });
}

menuItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    //changes the current slide
    wrapper.style.transform = `translateX(${-100 * index}vw)`;

    //changes the chosen product
    chosenProduct = products[index];
    trackUserInteraction(chosenProduct.title);
    trackUserInteractionWithPartitionedAdServer(chosenProduct.title);

    //changes the texts of current product
    currentProductTitle.textContent = chosenProduct.title.toUpperCase();
    currentProductPrice.textContent = '$' + chosenProduct.price;
    currentProductImg.src = chosenProduct.colors[0].img;

    //changes the style of product by selected color
    currentProductColors.forEach((color, index) => {
      color.style.backgroundColor = chosenProduct.colors[index].code;
    });
  });
});

currentProductColors.forEach((color, index) => {
  color.addEventListener('click', () => {
    currentProductImg.src = chosenProduct.colors[index].img;
  });
});

currentProductSizes.forEach((size, index) => {
  size.addEventListener('click', () => {
    currentProductSizes.forEach((size) => {
      size.style.backgroundColor = 'white';
      size.style.color = 'black';
    });
    size.style.backgroundColor = 'black';
    size.style.color = 'white';
  });
});

const productButton = document.querySelector('.productButton');
const payment = document.querySelector('.payment');
const close = document.querySelector('.close');

productButton.addEventListener('click', () => {
  payment.style.display = 'flex';
});
close.addEventListener('click', () => {
  payment.style.display = 'none';
});
