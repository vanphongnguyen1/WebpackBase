// import { total } from 'components/page/view/constant';
import Images from './assets/images/WZRD.png'

function createImgElement() {
    const imgElement = document.createElement('img')
    imgElement.src = Images
    imgElement.alt = 'webpack từ A đến Á cùng kentrung'
    return imgElement
  }

document.getElementById('root').appendChild(createImgElement())

const title = document.querySelector('#title')
title.innerHTML = 'AAAAAAAAAAAAA'
// console.log(total, 'aaaaaaaaaaaaa');
