import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';
import {
  getRemoteConfig,
  provideRemoteConfig,
} from '@angular/fire/remote-config';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const fbDebugConfig = {
  projectId: 'stats-mk-debug',
  appId: "1:736267730300:web:8a8dd1422d6a0b9a6cf8f9",
  databaseURL: "https://stats-mk-debug-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "stats-mk-debug.appspot.com",
  apiKey: "AIzaSyDC7g1H94KDN49ACj0KD6oVNYaZ9njOO7w",
  authDomain: "stats-mk-debug.firebaseapp.com",
  messagingSenderId: "736267730300",
};

const fbReleaseConfing = {
  projectId: 'stats-mk',
  appId: '1:527204567365:web:75706809161f3b0270162c',
  databaseURL:'https://stats-mk-default-rtdb.europe-west1.firebasedatabase.app',
  storageBucket: 'stats-mk.appspot.com',
  apiKey: 'AIzaSyBIH6XdclkrvXYGJzImA7wTA-vmU8n4_eI',
  authDomain: 'stats-mk.firebaseapp.com',
  messagingSenderId: '527204567365',
  measurementId: 'G-SPJW6S8NQ0',
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom([
      provideFirebaseApp(() =>
        initializeApp(fbDebugConfig)
      ),
      provideAuth(() => getAuth()),
      provideDatabase(() => getDatabase()),
      provideStorage(() => getStorage()),
      provideRemoteConfig(() => getRemoteConfig()),
    ]),
    provideAnimationsAsync(),
  ],
};
