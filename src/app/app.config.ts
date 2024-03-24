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

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom([
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'stats-mk',
          appId: '1:527204567365:web:75706809161f3b0270162c',
          databaseURL:
            'https://stats-mk-default-rtdb.europe-west1.firebasedatabase.app',
          storageBucket: 'stats-mk.appspot.com',
          apiKey: 'AIzaSyBIH6XdclkrvXYGJzImA7wTA-vmU8n4_eI',
          authDomain: 'stats-mk.firebaseapp.com',
          messagingSenderId: '527204567365',
          measurementId: 'G-SPJW6S8NQ0',
        })
      ),
      provideAuth(() => getAuth()),
      provideDatabase(() => getDatabase()),
      provideStorage(() => getStorage()),
      provideRemoteConfig(() => getRemoteConfig()),
    ]),
    provideAnimationsAsync(),
  ],
};
