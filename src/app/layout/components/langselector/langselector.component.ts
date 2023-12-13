import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-langselector',
  templateUrl: './langselector.component.html',
  styleUrls: ['./langselector.component.scss']
})
export class LangselectorComponent implements OnInit {
  public selectedLanguage: any;
  public languageOptions: any;

  constructor(
    public translateService: TranslateService,
  ) {

    this.languageOptions = {
      en: {
        title: 'English',
        flag: 'us'
      },
      es: {
        title: 'Español',
        flag:'es'
      },
      fr: {
        title: 'French',
        flag: 'fr'
      },
      de: {
        title: 'German',
        flag: 'de'
      },
      pt: {
        title: 'Portuguese',
        flag: 'pt'
      }
    };
  }

  ngOnInit(): void {
    // Set the selected language from default languageOptions
    this.selectedLanguage = _.find(this.languageOptions, {
      id: this.translateService.currentLang
    });
  }

  /**
   * Set the language
   *
   * @param language
   */
   setLanguage(language): void {
    // Set the selected language for the navbar on change
    this.selectedLanguage = language;

    // Use the selected language id for translations
    this.translateService.use(language);
  }

}
