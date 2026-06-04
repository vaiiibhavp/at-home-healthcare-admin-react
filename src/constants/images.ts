export const IMAGES = {
  injectionIcon: '/injectionicon.png',
  testTubeIcon: '/testtubeicon.png',
  nurseIcon: '/nurseicon.png',
  ivfIcon: '/ivficon.png',
  maskIcon: '/maskicon.png',
  bandegeIcon: '/bandageicon.png',
};

export const getServiceIcon = (id: string) => {
  switch (id) {
    case '69ef359fd1c1c4252d4b8d4f':
      return IMAGES.injectionIcon;
    case '69ef3557d1c1c4252d4b8d2c':
      return IMAGES.testTubeIcon;
    case '69ef3589d1c1c4252d4b8d45':
      return IMAGES.nurseIcon;
    case '69eb112a056b86c571c1a44f':
      return IMAGES.nurseIcon;
    case '69ef3592d1c1c4252d4b8d4a':
      return IMAGES.nurseIcon;
    case '69ef353fd1c1c4252d4b8d22':
      return IMAGES.ivfIcon;
    case '69ef354cd1c1c4252d4b8d27':
      return IMAGES.maskIcon;
    case '69ef356cd1c1c4252d4b8d36':
      return IMAGES.ivfIcon;
    case '69ef357cd1c1c4252d4b8d40':
      return IMAGES.ivfIcon;
    case '69ef3563d1c1c4252d4b8d31':
      return IMAGES.nurseIcon;
    case '69ef3575d1c1c4252d4b8d3b':
      return IMAGES.nurseIcon;
    case '69ef3534d1c1c4252d4b8d1d':
      return IMAGES.bandegeIcon;
    default:
      return IMAGES.nurseIcon;
  }
};
