import {getReadTime} from "./localStorage";

export const FONT_SIZE_LIST = [
  {fontSize: 12},
  {fontSize: 14},
  {fontSize: 16},
  {fontSize: 18},
  {fontSize: 20},
  {fontSize: 22},
  {fontSize: 24}
];

export const FONT_FAMILY = [
  {font: 'Default'},
  {font: 'Cabin'},
  {font: 'Days One'},
  {font: 'Montserrat'},
  {font: 'Tangerine'}
];

export function themeList(vue) {
  return [
    {
      alias: vue.$t('book.themeDefault'),
      name: 'Default',
      style: {
        body: {
          'color': '#4c5059',
          'background': '#cecece'
        }
      }
    },
    {
      alias: vue.$t('book.themeGold'),
      name: 'Gold',
      style: {
        body: {
          'color': '#5c5b56',
          'background': '#c6c2b6'
        }
      }
    },
    {
      alias: vue.$t('book.themeEye'),
      name: 'Eye',
      style: {
        body: {
          'color': '#404c42',
          'background': '#a9c1a9'
        }
      }
    },
    {
      alias: vue.$t('book.themeNight'),
      name: 'Night',
      style: {
        body: {
          'color': '#cecece',
          'background': '#000000'
        }
      }
    }
  ]
}

export function addCSS(href) {
  let link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  link.setAttribute('href', href);
  document.getElementsByTagName('head')[0].appendChild(link)

}

export function removeCSS(href) {
  let links = document.getElementsByTagName('link');
  for (let i = 0; i < links.length; i++) {
    let link = links[i];
    if (link.getAttribute('rel') === 'stylesheet' && link.getAttribute('href') === href) {
      link.parentNode.removeChild(link)
    }
  }
}

export function removeCSSAll() {
  let links = document.getElementsByTagName('link');
  for (let i = 0; i < links.length; i++) {
    let link = links[i];
    if (link.getAttribute('rel') === 'stylesheet' && link.getAttribute('href')) {
      if (link.getAttribute('href').indexOf(`${process.env.VUE_APP_RES_URL}/theme/theme_`) === -1) {
        link.parentNode.removeChild(link)
      }
    }
  }
}

export function getReadTimeByMinute(fileName) {
  let readTime = getReadTime(fileName);
  if (readTime) {
    return getReadTime(fileName) / 60;
  } else {
    return 0;
  }
}

export function flatten(array) {
  return [].concat(...array.map(item => [].concat(item, ...flatten(item.subitems))))
}
