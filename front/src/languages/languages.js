
// Language support for English and Finnish. The relevant object is returned depending of the selected language.
export const languages = {
  en: {
    lan: 'EN',
    loader: ['L', 'o', 'a', 'd', 'i', 'n', 'g', '.', '.', '.'],
    nav: {
      login: 'Log in',
      signUp: 'Sign up',
      dropDown: {
        settings: 'User settings',
        dark: 'Dark theme',
        light: 'Light theme',
        lan: 'Language',
        logout: 'Log out'
      }
    },
    main: {
      greetingNotLogged: ['Welcome to BPLog. ', 'Log in or create an account.'],
      greetingLogged: 'Welcome',
      new: 'New entry',
      view: 'View entries',
      stats: {
        headThis: 'This month:',
        headAll: 'All time:',
        avg: 'Average:',
        dev: 'Deviation',
        sys: 'Sys:',
        dia: 'Dia:',
        pul: 'Pul:'
      }
    },
    forms: {
      err: {
        empty: 'Field is required',
        outOfBounds: 'Value out of range '
      },
      login: {
        user: 'USERNAME:',
        pwd: 'PASSWORD:',
        log: 'LOG IN',
        err: 'Wrong username or password'
      },
      createAccount: {
        first: 'FIRST NAME:',
        last: 'LAST NAME:',
        birth: 'BIRTH YEAR:',
        birthSelect: '-- Select a year --',
        user: 'USERNAME:',
        pwd: 'PASSWORD:',
        pwdConf: 'CONFIRM PASSWORD:',
        height: 'HEIGHT (cm):',
        weight: 'WEIGHT (kg):',
        instr: 'Add frequently used medicines to your user profile. ' + 
               'Type a name of a medicine into the text input, and click ADD or press ENTER. ' +
               'A selected medicine can be removed from the list by clicking REMOVE button.<br />' +
               'This step is optional, and can be done later from user settings.',
        medList: 'MEDICINE LIST:',
        medListPlaceholder: 'Medicine name',        
        remConf: 'Remove medicine?',
        add: 'ADD',
        submit: 'SUBMIT',
        err: {
          nameTaken: ['Username ', ' not available'],
          pwdShort: 'Password has to consist of at least 6 characters',
          pwdConf: 'Password confirmation does not match'
        }
      },
      newRecord: {
        date: 'DATE:',
        time: 'TIME:',
        sys: 'SYSTOLIC:',
        dia: 'DIASTOLIC:',
        pul: 'PULSE:',
        meds: 'MEDICINES:',
        notes: 'NOTES:',
        submit: 'SUBMIT',
        msg: 'Entry created'
      },
      settings: {
        first: 'FIRST NAME:',
        last: 'LAST NAME:',
        birth: 'BIRTH YEAR:',
        birthSelect: '-- Select year --',
        height: 'HEIGHT (cm):',
        weight: 'WEIGHT (kg):',
        medList: 'MEDICINE LIST:',
        medListPlaceholder: 'Medicine name',
        remConf: 'Remove medicine?',
        add: 'ADD',
        submit: 'SAVE',
        cancel: 'CANCEL',
        notification: 'User data updated'
      },
      update: {
        updated: 'Entry updated'
      },
      select: {
        placeHolder: 'Select...'
      }
    },
    view: {
      viewOptions: {
        day: 'DAY',
        week: 'WEEK',
        month: 'MONTH'
      },
      pdf: {
        btn: 'Load as PDF',
        headings: [
          'Date',
          'Time',
          'Sys',
          'Dia',
          'Pul',
          'Medicines'
        ]
      },
      listItem: {
        sys: 'SYS',
        dia: 'DIA',
        pul: 'PUL',
        showMore: 'SHOW MORE',
        showLess: 'SHOW LESS',
        entry: {
          entries: 'ENTRIES:',
          meds: 'MEDICATION: ',
          notes: 'NOTES: ',
          confirm: 'Remove entry?',
          ok: 'REMOVE',
          cancel: 'CANCEL'
        }
      },
      iconBar: {
        home: 'Home',
        new: 'New',
        list: 'List',
        chart: 'Chart'
      }
    },
    monthNames: [
      'JAN.',
      'FEB.',
      'MAR.',
      'APR.',
      'MAY',
      'JUN.',
      'JUL.',
      'AUG.',
      'SEP.',
      'OCT.',
      'NOV.',
      'DEC.'
    ]
  },
  fi: {
    lan: 'FI',
    loader: ['L', 'a', 'd', 'a', 't', 'a', 'a', 'n', '.', '.', '.'],
    nav: {
      login: 'Kirjaudu',
      signUp: 'Luo tunnus',
      dropDown: {
        settings: 'Käyttäjäasetukset',
        dark: 'Tumma tila',
        light: 'Vaalea tila',
        lan: 'Kieli',
        logout: 'Kirjaudu ulos'
      }
    },
    main: {
      greetingNotLogged: ['Tervetuloa BPLogiin. ', 'Kirjaudu sisään tai luo käyttäjätunnus.'],
      greetingLogged: 'Tervetuloa',
      new: 'Uusi merkintä',
      view: 'Näytä merkinnät',
      stats: {
        headThis: 'Viimeisin kuukausi:',
        headAll: 'Historia:',
        avg: 'Keskiarvo:',
        dev: 'Keskihajonta',
        sys: 'Ylä:',
        dia: 'Ala:',
        pul: 'Pul:'
      }
    },
    forms: {
      err: {
        empty: 'Täytä kenttä',
        outOfBounds: 'Syötä arvo väliltä '
      },
      login: {
        user: 'KÄYTTÄJÄTUNNUS:',
        pwd: 'SALASANA:',
        log: 'KIRJAUDU',
        err: 'Väärä tunnus tai salasana'
      },
      createAccount: {
        first: 'ETUNIMI:',
        last: 'SUKUNIMI:',
        birth: 'SYNTYMÄVUOSI:',
        birthSelect: '-- Valitse vuosi --',
        user: 'KÄYTTÄJÄTUNNUS:',
        pwd: 'SALASANA:',
        pwdConf: 'VARMISTA SALASANA:',
        height: 'PITUS (cm):',
        weight: 'PAINO (kg):',
        instr: 'Lisää säännöllisesti käyttämäsi lääkkeet profiiliisi. ' + 
               'Kirjoita lääkkeen nimi tekstikenttään, ja hyväksy painamalla LISÄÄ tai ENTER. ' +
               'Tämä vaihe on valinnainen, ja sen voi tehdä myöhemmin käyttäjäasetuksista.',
        medList: 'LÄÄKELISTA:',
        medListPlaceholder: 'Lääkkeen nimi',
        remConf: 'Poistetaanko lääke?',
        add: 'LISÄÄ',
        submit: 'LÄHETÄ',
        err: {
          nameTaken: ['Tunnus ', ' on jo käytössä'],
          pwdShort: 'Salasanassa täytyy olla vähintään 6 merkkiä',
          pwdConf: 'Salasanan varmistus ei täsmää'
        }
      },
      newRecord: {
        date: 'PÄIVÄYS:',
        time: 'AIKA:',
        sys: 'YLÄPAINE:',
        dia: 'ALAPAINE:',
        pul: 'SYKE:',
        meds: 'LÄÄKKEET:',
        notes: 'MUISTIINPANOT:',
        submit: 'TALLENNA',
        msg: 'Merkintä tallennettu'
      },
      settings: {
        first: 'ETUNIMI:',
        last: 'SUKUNIMI:',
        birth: 'SYNTYMÄVUOSI:',
        birthSelect: '-- Valitse vuosi --',
        height: 'PITUS (cm):',
        weight: 'PAINO (kg):',
        medList: 'LÄÄKELISTA:',
        medListPlaceholder: 'Lääkkeen nimi',
        remConf: 'Poistetaanko lääke?',
        add: 'LISÄÄ',
        submit: 'TALLENNA',
        cancel: 'PERU',
        notification: 'Tiedot päivitetty'
      },
      update: {
        updated: 'Muutokset tallennettu'
      },
      select: {
        placeHolder: 'Valinnat...'
      }
    },
    view: {
      viewOptions: {
        day: 'PÄIVÄ',
        week: 'VIIKKO',
        month: 'KUUKAUSI'
      },
      pdf: {
        btn: 'Lataa PDF',
        headings: [
          'Päiväys',
          'Aika',
          'Ylä',
          'Ala',
          'Pul',
          'Lääkkeet'
        ]
      },
      listItem: {
        sys: 'YLÄ',
        dia: 'ALA',
        pul: 'PUL',
        showMore: 'LAAJENNA',
        showLess: 'SUPISTA',
        entry: {
          entries: 'MERKINNÄT:',
          meds: 'LÄÄKKEET: ',
          notes: 'MUISTIINPANOT: ',
          confirm: 'Poista merkintä?',
          ok: 'POISTA',
          cancel: 'PERUUTA'
        }
      },
      iconBar: {
        home: 'Etusivu',
        new: 'Uusi',
        list: 'Lista',
        chart: 'Kuvaaja'
      }
    },
    monthNames: [
      'TAM.',
      'HEL.',
      'MAA.',
      'HUH.',
      'TOU',
      'KES.',
      'HEI.',
      'ELO.',
      'SYY.',
      'LOK.',
      'MAR.',
      'JOU.'
    ]
  }
}