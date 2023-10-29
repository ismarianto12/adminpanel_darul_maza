const navigation = () => {


  const userDataJSON = localStorage.getItem("userData");
  const userData = JSON.parse(userDataJSON);
  const role = userData[0]?.role;

  // admin super user
  // panitia pdb
  // bagian akademik

  if (role === '1') {

    return [
      {
        title: 'Dashboard',
        icon: 'tabler:smart-home',
        badgeColor: 'success',
        background: 'red',
        active: true,
        path: '/home',
        auth: false,
      },
      {
        title: 'PPDB',
        icon: 'tabler:files',
        auth: false,

        children: [
          {
            title: 'SET UP PPDB',
            path: '/download/list',
            auth: false,
          },
          {
            title: 'PARAMATER BIAYA',
            path: '/video/list',
            auth: false,
          },
          {
            title: 'DATA PPDB',
            path: '/ppdb/list',
            auth: false,
          },
          {
            title: 'KONFIRMASI BAYAR',
            path: '/jadwal/list',
            auth: false,
          }
        ]
      },

      {
        title: 'Akademik',
        icon: 'tabler:users',
        auth: false,
        children: [
          {
            title: 'MASTER SISWA',
            path: '/siswa/list',
            auth: false,
          },
          {
            title: 'MASTER PEGAWAI',
            path: '/pegawai/list',
            auth: false,
          },
          {
            title: 'MASTER GURU',
            path: '/guru/list',
            auth: false,
          }
        ]
      },
      {
        title: 'MASTER',
        icon: 'tabler:news',
        auth: false,
        children: [
          {
            title: 'ACARA',
            path: '/award/list',
            auth: false,
          },
          {
            title: 'GALERY',
            path: '/statistik/list',
            auth: false,
          }
        ]
      },

      {
        title: 'Master Data',
        icon: 'tabler:copy',
        auth: false,
        children: [
          {
            title: 'User',
            path: '/struktur',
            auth: false,
          },
          {
            title: 'Level Akses',
            path: '/category/list',
            auth: false,
          },
          {
            title: 'Identitas Aplikasi',
            path: '/tag/list',
            auth: false,
          },

        ]
      },
      // {
      //   title: 'Artikel',
      //   icon: 'tabler:chart-bar',
      //   auth: false,
      //   children: [
      //     {
      //       title: 'News',
      //       auth: false,
      //       path: '/news'
      //     },
      //     {
      //       title: 'Halaman',
      //       auth: false,
      //       path: '/halaman'
      //     },
      //   ]
      // },
      // {
      //   title: 'Galery',
      //   icon: 'tabler:file',
      //   auth: false,
      //   children: [
      //     {
      //       title: 'Album',
      //       path: '/album/list',
      //       auth: false,
      //     },
      //     {
      //       title: 'Slider',
      //       path: '/slider/list',
      //       auth: false,
      //     },
      //     {
      //       title: 'Galery',
      //       auth: false,
      //       path: '/galery/list'
      //     }
      //     , {
      //       title: 'Promo',
      //       auth: false,
      //       path: '/promo/list'
      //     }

      //   ]
      // },
      // {
      //   title: 'User',
      //   auth: false,
      //   icon: 'tabler:user',
      //   children: [
      //     {
      //       title: 'List',
      //       auth: false,
      //       path: '/user/list'
      //     },
      //     {
      //       title: 'Level',
      //       auth: false,
      //       path: '/level/list'
      //     }
      //   ]
      // },
    ]
  } else {
    return [
      {
        title: 'Dashboard',
        icon: 'tabler:smart-home',
        badgeColor: 'error',
        path: '/home',
        auth: false,
        active: true
      },
      {
        title: 'Hightligt',
        icon: 'tabler:files',
        auth: false,

        children: [
          {
            title: 'Download Area',
            path: '/download/list',
            auth: false,
          },
          {
            title: 'Video Edukasi',
            path: '/video/list',
            auth: false,
          },
          {
            title: 'Jadwal Edukasi',
            path: '/jadwal/list',
            auth: false,
          }

        ]
      },
      {
        title: 'Artikel',
        icon: 'tabler:chart-bar',
        auth: false,
        children: [
          {
            title: 'News',
            auth: false,
            path: '/news'
          },
          {
            title: 'Halaman',
            auth: false,
            path: '/halaman'
          },
        ]
      },
      {
        title: 'Galery',
        icon: 'tabler:file',
        auth: false,
        children: [
          {
            title: 'Album',
            path: '/album/list',
            auth: false,
          },
          {
            title: 'Galery',
            auth: false,
            path: '/galery/list'
          }
          , {
            title: 'Promo',
            auth: false,
            path: '/promo/list'
          }

        ]
      },
    ]
  }
}

export default navigation
