import { html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { DateTime } from 'luxon';
import './icons/icon-search.js';
import './icons/icon-plus.js';
import './icons/icon-trash.js';

export class ProcForm extends LitElement {
  // use lightDOM
  createRenderRoot() {
    return this;
  }

  static get properties() {
    return {
      procedure: { type: Object },
      editmode: { type: Boolean, state: true },
      _currentProcStartDateTime: { type: String, state: true },
      _currentProcEndDateTime: { type: String, state: true },
      _currentAnestStartDateTime: { type: String, state: true },
      _currentAnestEndDateTime: { type: String, state: true },
      patients: { type: Array },
      _currentPatient: { type: Object, state: true },
      _patientName: { type: String, state: true },
      _activatePatientSearchDropDown: { type: Boolean, state: true },
      _ward: { type: String, state: true },
      _bed: { type: String, state: true },
      _destWard: { type: String, state: true },
      _destBed: { type: String, state: true },
      _team: { type: String, state: true },
      _circulatingNurse: { type: Object, state: true },
      _circulatingNurseName: { type: String, state: true },
      _surgicalRoom: { type: String, state: true },
      _surgicalComplexity: { type: String, state: true },
      _typeOfSurgery: { type: String, state: true },
      _contaminationRisk: { type: String, state: true },
      _wasCanceled: { type: Boolean, state: true },
      _cancelationReason: { type: String, state: true },
      _antibioticUse: { type: Boolean, state: true },
      _procGroup: { type: String, state: true },
      _activateUserSearchDropDown: { type: Boolean, state: true },
      _activateCirculatingNurseSearchDropDown: { type: Boolean, state: true },
      proctypes: { type: Array },
      _currentProcType: { type: Object, state: true },
      _procTypeDescr: { type: String, state: true },
      _activateProcTypeSearchDropDown: { type: Boolean, state: true },
      _showRequiredSurgReport: { type: Boolean, state: true },
      user: { type: Object },
      users: { type: Array },
      _currentUser: { type: Object, state: true },
      _userName: { type: String, state: true },
      _maxUsersCount: { type: Number, state: true },
      _currentProcUsers: { type: Array, state: true },
      _currentProcAnesthesiologists: { type: Array, state: true },
      _maxAnesthesiologistsCount: { type: Number, state: true },
      _anesthesiologistName: { type: String, state: true },
      _anesthesiaType: { type: String, state: true },
      _anesthesiaSubType: { type: String, state: true },
      _riskClassASA: { type: String, state: true },
      _notes: { type: String, state: true },
    };
  }

  constructor() {
    super();
    this._patientName = '';
    this._circulatingNurse = {};
    this._circulatingNurseName = '';
    this._activateCirculatingNurseSearchDropDown = false;
    this._currentPatient = {};
    this._activatePatientSearchDropDown = false;
    this._ward = '';
    this._bed = '';
    this._destWard = '';
    this._destBed = '';
    this._userName = '';
    this.users = [];
    this._team = '';
    this._surgicalRoom = '';
    this._surgicalComplexity = '';
    this._typeOfSurgery = '';
    this._contaminationRisk = '';
    this._wasCanceled = false;
    this._cancelationReason = '';
    this._antibioticUse = false;
    this._procGroup = '';
    this._currentUser = {};
    this._activateUserSearchDropDown = false;
    this.proctypes = [];
    this._procTypeDescr = '';
    this._activateProcTypeSearchDropDown = false;
    this._showRequiredSurgReport = false;
    this._maxUsersCount = 5;
    this._currentProcUsers = [];
    this._maxAnesthesiologistsCount = 2;
    this._currentProcAnesthesiologists = [];
    this._anesthesiologistName = '';
    this._activateAnesthesiologistSearchDropDown = false;
    this._anesthesiaType = '';
    this._anesthesiaSubType = '';
    this._riskClassASA = '';
    this._notes = '';
  }

  firstUpdated() {
    const d = DateTime.local().toISO();
    // remove seconds and milliseconds from iso string date
    const dShort = d.slice(0, 16);
    this._currentProcStartDateTime = dShort;
    this._currentProcEndDateTime = dShort;
    this._currentAnestStartDateTime = dShort;
    this._currentAnestEndDateTime = dShort;
    // eslint-disable-next-line no-console
    // console.log(JSON.stringify(d, null, 2));
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(this._currentProcStartDateTime, null, 2));
  }

  /**
   * @param {{ has: (arg0: string) => any; }} changedProperties
   */
  updated(changedProperties) {
    if (
      this.editmode &&
      changedProperties.has('procedure') &&
      this.procedure &&
      this.procedure.procStartDateTime
    ) {
      // eslint-disable-next-line no-console
      // console.log('procedure changed and is defined');
      // eslint-disable-next-line no-console
      // console.log(JSON.stringify(this.procedure, null, 2));
      this._currentPatient = {
        name: this.procedure.ptName,
        recNumber: this.procedure.ptRecN,
        id: this.procedure.ptID,
        dateOfBirth: this.procedure.ptDateOfBirth,
        gender: this.procedure.ptGender,
      };
      this._patientName = this._currentPatient.name;

      this._bed = this.procedure.ptBed;
      this._ward = this.procedure.ptWard;
      this._destBed = this.procedure.ptDestBed;
      this._destWard = this.procedure.ptDestWard;

      this._currentProcType = {
        descr: this.procedure.descr,
        code: this.procedure.code,
      };
      this.proctypes = [{ ...this._currentProcType }];
      this._procTypeDescr = this.procedure.descr;

      this._wasCanceled = this.procedure.wasCanceled;
      this._cancelationReason = this.procedure.cancelationReason;
      // eslint-disable-next-line no-console
      console.log(JSON.stringify('about to change dates'));

      this._currentProcStartDateTime = DateTime.fromSQL(
        this.procedure.procStartDateTime
      ).toFormat("yyyy'-'LL'-'dd'T'HH:mm");
      // eslint-disable-next-line no-console
      console.log(this._currentProcStartDateTime);
      this._currentProcEndDateTime = DateTime.fromSQL(
        this.procedure.procEndDateTime
      ).toFormat("yyyy'-'LL'-'dd'T'HH:mm");
      // eslint-disable-next-line no-console
      console.log(this._currentProcEndDateTime);

      this._surgicalComplexity = this.procedure.surgicalComplexity;
      this._typeOfSurgery = this.procedure.typeOfSurgery;

      this._contaminationRisk = this.procedure.contaminationRisk;
      this._antibioticUse = this.procedure.antibioticUse;

      this._procGroup = this.procedure.procGroup;
      this._surgicalRoom = this.procedure.surgicalRoom;

      this._team = this.procedure.team;

      this._currentProcUsers = [];
      this._currentProcUsers.push({
        name: this.procedure.user1Name,
        id: this.procedure.user1ID,
        licenceNumber: this.procedure.user1LicenceNumber,
      });

      if (
        this.procedure.user2Name !== '' &&
        this.procedure.user2ID !== '' &&
        this.procedure.user2LicenceNumber !== ''
      ) {
        this._currentProcUsers.push({
          name: this.procedure.user2Name,
          id: this.procedure.user2ID,
          licenceNumber: this.procedure.user2LicenceNumber,
        });
      }
      if (
        this.procedure.user3Name !== '' &&
        this.procedure.user3ID !== '' &&
        this.procedure.user3LicenceNumber !== ''
      ) {
        this._currentProcUsers.push({
          name: this.procedure.user3Name,
          id: this.procedure.user3ID,
          licenceNumber: this.procedure.user3LicenceNumber,
        });
      }
      if (
        this.procedure.user4Name !== '' &&
        this.procedure.user4ID !== '' &&
        this.procedure.user4LicenceNumber !== ''
      ) {
        this._currentProcUsers.push({
          name: this.procedure.user4Name,
          id: this.procedure.user4ID,
          licenceNumber: this.procedure.user4LicenceNumber,
        });
      }
      if (
        this.procedure.user5Name !== '' &&
        this.procedure.user5ID !== '' &&
        this.procedure.user5LicenceNumber !== ''
      ) {
        this._currentProcUsers.push({
          name: this.procedure.user5Name,
          id: this.procedure.user5ID,
          licenceNumber: this.procedure.user5LicenceNumber,
        });
      }
      if (
        this.procedure.user6Name !== '' &&
        this.procedure.user6ID !== '' &&
        this.procedure.user6LicenceNumber !== ''
      ) {
        this._currentProcUsers.push({
          name: this.procedure.user6Name,
          id: this.procedure.user6ID,
          licenceNumber: this.procedure.user6LicenceNumber,
        });
      }
      this._circulatingNurse = {
        name: this.procedure.circulatingNurse,
        id: this.procedure.circulatingNurseID,
      };
      this._circulatingNurseName = this.procedure.circulatingNurse;
      this._circulatingNurseID = this.procedure.circulatingNurseID;

      this._anesthesiaType = this.procedure.anesthesiaType;
      this._anesthesiaSubType = this.procedure.anesthesiaSubType;
      this._riskClassASA = this.procedure._riskClassASA;

      this._currentAnestStartDateTime = DateTime.fromSQL(
        this.procedure.anestStartDateTime
      ).toFormat("yyyy'-'LL'-'dd'T'HH:mm");
      this._currentAnestEndDateTime = DateTime.fromSQL(
        this.procedure.anestEndDateTime
      ).toFormat("yyyy'-'LL'-'dd'T'HH:mm");

      this._currentProcAnesthesiologists = [];

      if (
        this.procedure.anestesiologist1Name !== '' &&
        this.procedure.anestesiologist1ID !== '' &&
        this.procedure.anestesiologist1LicenceNumber !== ''
      ) {
        this._currentProcUsers.push({
          name: this.procedure.anestesiologist1Name,
          id: this.procedure.anestesiologist1ID,
          licenceNumber: this.procedure.anestesiologist1LicenceNumber,
        });
      }
      if (
        this.procedure.anestesiologist2Name !== '' &&
        this.procedure.anestesiologist2ID !== '' &&
        this.procedure.anestesiologist2LicenceNumber !== ''
      ) {
        this._currentProcUsers.push({
          name: this.procedure.anestesiologist2Name,
          id: this.procedure.anestesiologist2ID,
          licenceNumber: this.procedure.anestesiologist2LicenceNumber,
        });
      }
      if (
        this.procedure.anestesiologist3Name !== '' &&
        this.procedure.anestesiologist3ID !== '' &&
        this.procedure.anestesiologist3LicenceNumber !== ''
      ) {
        this._currentProcUsers.push({
          name: this.procedure.anestesiologist3Name,
          id: this.procedure.anestesiologist3ID,
          licenceNumber: this.procedure.anestesiologist3LicenceNumber,
        });
      }

      this._notes = this.procedure.notes;
    } else if (!this.editmode && !this.procedure) {
      this._clearFields();
    }
  }

  _closeForm() {
    // clear form
    this._clearFields();
    // fire event to hide procedure form from parent's view
    this.dispatchEvent(
      new CustomEvent('close-procedure-form', { bubbles: true, composed: true })
    );
  }

  async _clearFields() {
    this.procedure = {};
    // this._createEditLabel = "Adicionar";
    // @ts-ignore
    await document.getElementById('procedure-form').reset();
    this._procedureName = '';
    this._procTypeDescr = '';
    this._activateProcTypeSearchDropDown = false;
    this._showRequiredSurgReport = false;
    this._patientName = '';
    this._circulatingNurse = {};
    this._circulatingNurseName = '';
    this._currentPatient = {};
    this._activatePatientSearchDropDown = false;
    this._ward = '';
    this._bed = '';
    this._destWard = '';
    this._destBed = '';
    this._team = '';
    this._surgicalRoom = '';
    this._surgicalComplexity = '';
    this._typeOfSurgery = '';
    this._contaminationRisk = '';
    this._wasCanceled = false;
    this._cancelationReason = '';
    this._antibioticUse = false;
    this._procGroup = '';
    this._userName = '';
    this._activateUserSearchDropDown = false;
    this._activateCirculatingNurseSearchDropDown = false;
    this._activateAnesthesiologistSearchDropDown = false;
    this._currentProcUsers = [];
    this._maxUsersCount = 5;
    this._maxAnesthesiologistsCount = 2;
    this._currentProcAnesthesiologists = [];
    this._anesthesiologistName = '';
    this._anesthesiaType = '';
    this._anesthesiaSubType = '';
    this._riskClassASA = '';
    this._notes = '';
    // try to circunvent a race condition with the above procedure-form reset
    setTimeout(() => {
      const d = DateTime.local().toISO();
      // remove seconds and milliseconds from iso string date
      const dShort = d.slice(0, 16);
      this._currentProcStartDateTime = dShort;
      this._currentProcEndDateTime = dShort;
      this._currentAnestStartDateTime = dShort;
      this._currentAnestEndDateTime = dShort;
    }, 2000);
  }

  _saveForm(e) {
    e.preventDefault();
    if (document.getElementById('procedure-form').reportValidity()) {
      if (this._currentProcUsers.length > 0) {
        this._handleSaveForm();
      } else if (this._currentProcUsers.length === 0) {
        this.dispatchEvent(
          new CustomEvent('show-modal-message', {
            detail: { msg: 'Busque e selecione pelo menos um executante' },
            bubbles: true,
            composed: true,
          })
        );
      }
    }
  }

  _handleSaveForm() {
    // eslint-disable-next-line no-console
    // console.log(
    // `currentProcDate: ${this._currentProcDate}\n
    // currentProcHour: ${this._currentProcHour}\n
    // currentProcMinute: ${this._currentProcMinute}`
    // );

    // const dateTime = DateTime.fromISO(
    // `${this._currentProcDate}T${this._currentProcHour}:${this._currentProcMinute}:00.000-03:00`
    // );
    const procStartDateTime = DateTime.fromISO(this._currentProcStartDateTime);
    const procEndDateTime = DateTime.fromISO(this._currentProcEndDateTime);
    const procDuration = procEndDateTime
      .diff(procStartDateTime, 'minutes')
      .toObject();
    const anestStartDateTime = DateTime.fromISO(
      this._currentAnestStartDateTime
    );
    const anestEndDateTime = DateTime.fromISO(this._currentAnestEndDateTime);
    const anestDuration = anestEndDateTime
      .diff(anestStartDateTime, 'minutes')
      .toObject();
    // eslint-disable-next-line no-console
    // console.log(JSON.stringify(dateTime, null, 2));
    // eslint-disable-next-line no-console
    // console.log(`pt dateOfBirth: ${this._currentPatient.dateOfBirth}`);
    const ptDOB = DateTime.fromSQL(this._currentPatient.dateOfBirth);
    // eslint-disable-next-line no-console
    // console.log(`ptDOB: ${ptDOB}`);
    const ageObj = procStartDateTime.diff(ptDOB, 'years').toObject();
    const age = parseInt(ageObj.years, 10);
    // eslint-disable-next-line no-console
    // console.log(`age: ${age} years`);
    // eslint-disable-next-line no-console
    // console.log(`dateTime.format: ${dateTime.toISO()}`);
    // eslint-disable-next-line no-console
    // console.log(`pt dateOfBirth: ${ptDOB.toISO()}`);

    const p = {
      descr: this._currentProcType.descr,
      code: this._currentProcType.code,
      procStartDateTime: procStartDateTime.toISO(),
      procEndDateTime: procEndDateTime.toISO(),
      procDuration: parseInt(procDuration.minutes, 10),
      anestStartDateTime: anestStartDateTime.toISO(),
      anestEndDateTime: anestEndDateTime.toISO(),
      anestDuration: parseInt(anestDuration.minutes, 10),
      ptName: this._currentPatient.name,
      ptRecN: this._currentPatient.recNumber,
      ptID: this._currentPatient.id,
      ptDateOfBirth: ptDOB.toISO(),
      ptAge: age,
      ptGender: this._currentPatient.gender,
      ptCity: this._currentPatient.city,
      ptState: this._currentPatient.state,
      ptWard: this._ward,
      ptBed: this._bed,
      team: this._team,
      ptDestWard: this._destWard,
      ptDestBed: this._destBed,
      surgicalRoom: this._surgicalRoom,
      surgicalComplexity: this._surgicalComplexity,
      typeOfSurgery: this._typeOfSurgery,
      procGroup: this._procGroup,
      contaminationRisk: this._contaminationRisk,
      wasCanceled: this._wasCanceled,
      cancelationReason: this._cancelationReason,
      antibioticUse: this._antibioticUse,
      user1Name: '',
      user1ID: '',
      user1LicenceNumber: '',
      user2Name: '',
      user2ID: '',
      user2LicenceNumber: '',
      user3Name: '',
      user3ID: '',
      user3LicenceNumber: '',
      user4Name: '',
      user4ID: '',
      user4LicenceNumber: '',
      user5Name: '',
      user5ID: '',
      user5LicenceNumber: '',
      user6Name: '',
      user6ID: '',
      user6LicenceNumber: '',
      circulatingNurse: '',
      circulatingNurseID: '',
      anesthesiologist1Name: '',
      anesthesiologist1LicenceNumber: '',
      anesthesiologist1ID: '',
      anesthesiologist2Name: '',
      anesthesiologist2LicenceNumber: '',
      anesthesiologist2ID: '',
      anesthesiologist3Name: '',
      anesthesiologist3LicenceNumber: '',
      anesthesiologist3ID: '',
      anesthesiaType: this._anesthesiaType,
      anesthesiaSubType: this._anesthesiaSubType,
      notes: this._notes,
      updatedByUserName: this.user.name,
      updatedByUserID: this.user.id,
    };
    if (this.procedure && this.procedure.id) {
      // it is a procedure edit
      p.id = this.procedure.id;
      p.createdByUserName = this.procedure.createdByUserName;
      p.createdByUserID = this.procedure.createdByUserID;
    } else {
      // it is a new procedure
      p.createdByUserName = this.user.name;
      p.createdByUserID = this.user.id;
    }

    if (this._currentProcUsers.length > 0) {
      const u = this._currentProcUsers.shift();
      p.user1Name = u.name;
      p.user1ID = u.id;
      p.user1LicenceNumber = u.licenceNumber;
    }
    if (this._currentProcUsers.length > 0) {
      const u = this._currentProcUsers.shift();
      p.user2Name = u.name;
      p.user2ID = u.id;
      p.user2LicenceNumber = u.licenceNumber;
    }
    if (this._currentProcUsers.length > 0) {
      const u = this._currentProcUsers.shift();
      p.user3Name = u.name;
      p.user3ID = u.id;
      p.user3LicenceNumber = u.licenceNumber;
    }
    if (this._currentProcUsers.length > 0) {
      const u = this._currentProcUsers.shift();
      p.user4Name = u.name;
      p.user4ID = u.id;
      p.user4LicenceNumber = u.licenceNumber;
    }
    if (this._currentProcUsers.length > 0) {
      const u = this._currentProcUsers.shift();
      p.user5Name = u.name;
      p.user5ID = u.id;
      p.user5LicenceNumber = u.licenceNumber;
    }
    if (this._currentProcUsers.length > 0) {
      const u = this._currentProcUsers.shift();
      p.user6Name = u.name;
      p.user6ID = u.id;
      p.user6LicenceNumber = u.licenceNumber;
    }

    if (
      this._circulatingNurse &&
      this._circulatingNurse.name &&
      this.circulatingNurseID
    ) {
      p.circulatingNurse = this._circulatingNurse.name;
      p.circulatingNurseID = this._circulatingNurseID;
    }
    if (this._currentProcAnesthesiologists.length > 0) {
      const u = this._currentProcAnesthesiologists.shift();
      p.anestesiologist1Name = u.name;
      p.anesthesiologist1ID = u.id;
      p.anesthesiologist1LicenceNumber = u.licenceNumber;
    }
    if (this._currentProcAnesthesiologists.length > 0) {
      const u = this._currentProcAnesthesiologists.shift();
      p.anestesiologist2Name = u.name;
      p.anesthesiologist2ID = u.id;
      p.anesthesiologist2LicenceNumber = u.licenceNumber;
    }
    if (this._currentProcAnesthesiologists.length > 0) {
      const u = this._currentProcAnesthesiologists.shift();
      p.anestesiologist3Name = u.name;
      p.anesthesiologist3ID = u.id;
      p.anesthesiologist3LicenceNumber = u.licenceNumber;
    }

    // fire event to save/update procedure
    this.dispatchEvent(
      new CustomEvent('save-procedure-form', {
        detail: p,
        bubbles: true,
        composed: true,
      })
    );

    // clear and close form
    this._closeForm();
  }

  _searchUser(e) {
    // eslint-disable-next-line no-console
    // console.log(e.target.value);
    // fire event to hide procedure form from parent's view

    if (e.target.value.length > 2) {
      this.dispatchEvent(
        new CustomEvent('search-user', {
          detail: {
            search: e.target.value,
            skip: 0,
          },
          bubbles: true,
          composed: true,
        })
      );
      this._activateUserSearchDropDown = true;
    }
  }

  _searchAnesthesiologist(e) {
    // eslint-disable-next-line no-console
    // console.log(e.target.value);
    // fire event to hide procedure form from parent's view

    if (e.target.value.length > 2) {
      this.dispatchEvent(
        new CustomEvent('search-user', {
          detail: {
            search: e.target.value,
            skip: 0,
          },
          bubbles: true,
          composed: true,
        })
      );
      this._activateAnesthesiologistSearchDropDown = true;
    }
  }

  _searchCirculatingNurse(e) {
    // eslint-disable-next-line no-console
    // console.log(e.target.value);
    // fire event to hide procedure form from parent's view

    if (e.target.value.length > 2) {
      this.dispatchEvent(
        new CustomEvent('search-user', {
          detail: {
            search: e.target.value,
            skip: 0,
          },
          bubbles: true,
          composed: true,
        })
      );
      this._activateCirculatingNurseSearchDropDown = true;
    }
  }

  _circulatingNurseSelected(u) {
    // eslint-disable-next-line no-console
    // console.log(JSON.stringify(u, null, 2));
    if (!u.licenceNumber) {
      this.dispatchEvent(
        new CustomEvent('show-modal-message', {
          detail: {
            msg: 'Selecione um executante que tenha registro profissional (Coren)',
          },
          bubbles: true,
          composed: true,
        })
      );
    } else {
      this._circulatingNurse = { ...u };
      this._circulatingNurseName = u.name;
    }
    this._activateCirculatingNurseSearchDropDown = false;
  }

  _userSelected(u) {
    this._userName = u.name;
    // eslint-disable-next-line no-console
    // console.log(JSON.stringify(u, null, 2));
    if (!u.licenceNumber) {
      this.dispatchEvent(
        new CustomEvent('show-modal-message', {
          detail: {
            msg: 'Selecione um executante que tenha registro profissional (CRM)',
          },
          bubbles: true,
          composed: true,
        })
      );
    } else if (this._maxUsersCount >= 0) {
      this._currentProcUsers.push({ ...u });
      this._maxUsersCount -= 1;
    }
    this._activateUserSearchDropDown = false;
  }

  _anesthesiologistSelected(u) {
    this._anesthesiologistName = u.name;
    // eslint-disable-next-line no-console
    // console.log(JSON.stringify(u, null, 2));
    if (!u.licenceNumber) {
      this.dispatchEvent(
        new CustomEvent('show-modal-message', {
          detail: {
            msg: 'Selecione um executante que tenha registro profissional (CRM)',
          },
          bubbles: true,
          composed: true,
        })
      );
    } else if (this._maxAnesthesiologistsCount >= 0) {
      this._currentProcAnesthesiologists.push({ ...u });
      this._maxAnesthesiologistsCount -= 1;
    }
    this._activateAnesthesiologistSearchDropDown = false;
  }

  _searchPatient(e) {
    // eslint-disable-next-line no-console
    // console.log(e.target.value);
    // fire event to hide procedure form from parent's view

    if (e.target.value.length > 2) {
      this.dispatchEvent(
        new CustomEvent('search-patient', {
          detail: {
            search: e.target.value,
            skip: 0,
          },
          bubbles: true,
          composed: true,
        })
      );
      this._activatePatientSearchDropDown = true;
    }
  }

  _patientSelected(p) {
    // eslint-disable-next-line no-console
    // console.log(JSON.stringify(p, null, 2));
    this._currentPatient = { ...p };
    this._patientName = p.name;
    this._activatePatientSearchDropDown = false;
  }

  _searchProcType(e) {
    // eslint-disable-next-line no-console
    // console.log(e.target.value);
    // fire event to hide procedure form from parent's view

    if (e.target.value.length > 2) {
      this.dispatchEvent(
        new CustomEvent('search-procedure-type', {
          detail: {
            search: e.target.value,
            skip: 0,
          },
          bubbles: true,
          composed: true,
        })
      );
      this._activateProcTypeSearchDropDown = true;
    }
  }

  _procTypeSelected(p) {
    // eslint-disable-next-line no-console
    // console.log(JSON.stringify(p, null, 2));
    this._currentProcType = { ...p };
    this._procTypeDescr = p.descr;
    this._activateProcTypeSearchDropDown = false;
    this._showRequiredSurgReport = p.requireSurgReport;
  }

  _addPatient(e) {
    e.preventDefault();
    // fire event to hide procedure form from parent's view
    this.dispatchEvent(
      new CustomEvent('add-patient', { bubbles: true, composed: true })
    );
  }

  _removeProcUser(i) {
    const users = [...this._currentProcUsers];
    users.splice(i, 1);
    this._currentProcUsers = [...users];
  }

  _removeProcAnesthesiologist(i) {
    const anesthesiologists = [...this._currentProcAnesthesiologists];
    anesthesiologists.splice(i, 1);
    this._currentProcAnesthesiologists = [...anesthesiologists];
  }

  render() {
    return html`
      <section class="section">
        <div class="column is-6 is-offset-3">
          <div class="container">
            <h1 class="subtitle has-text-centered is-3">
              ${this.editmode ? 'Editar' : 'Adicionar'} Procedimento
            </h1>
            <form autocomplete="off" id="procedure-form">
              <!-- patients dropdown search -->
              <div
                class="is-flex
                is-flex-direction-row"
              >
                <div
                  class="dropdown 
                  ${classMap({
                    'is-active': this._activatePatientSearchDropDown,
                  })}"
                >
                  <div class="field is-flex-grow-5 is-horizontal">
                    <div
                      style="padding-right: 20px; padding-top: 8px;"
                      class="label is-normal"
                    >
                      <label><b>Paciente</b></label>
                    </div>
                    <div class="field-body">
                      <div class="dropdown-trigger">
                        <div class="field">
                          <div class="control is-expanded has-icons-right">
                            <input
                              class="input"
                              type="search"
                              @input="${this._searchPatient}"
                              .value="${this._patientName}"
                              placeholder="buscar pelo nome ou registro"
                              required
                            />
                            <icon-search></icon-search>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="dropdown-menu" id="dropdown-menu" role="menu">
                    <div class="dropdown-content">
                      ${
                        this.patients
                          ? this.patients.map(
                              p => html`
                                <a
                                  href="#"
                                  class="dropdown-item"
                                  @click="${e => {
                                    e.preventDefault();
                                    this._patientSelected(p);
                                  }}"
                                  @keydown="${e => {
                                    e.preventDefault();
                                    this._patientSelected(p);
                                  }}"
                                >
                                  ${p.name} - Reg: ${p.recNumber}</a
                                >
                              `
                            )
                          : html`<p></p>`
                      }
                    </div>
                  </div>
                </div>
                <div class="">
                  <button
                    class="button 
                    is-ghost
                    has-tooltip-arrow
                    has-tooltip-top"
                    data-tooltip="Criar"
                    @click="${this._addPatient}"
                    @keydown="${this._addPatient}"
                  >
                    <icon-plus></icon-plus>
                  </button>
                </div>
              </div>
              <div
                class="field is-flex 
                is-flex-direction-row
                is-justify-content-space-between"
              >
                <div
                  class="field is-flex 
                  is-flex-grow-1 is-horizontal"
                >
                  <div class="field-label is-normal">
                    <label class="label">Origem</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <input
                        class="input"
                        id="ward"
                        name="ward"
                        list="wards"
                        type="text"
                        placeholder="Setor de Origem"
                        .value="${this._ward}"
                        @blur="${e => {
                          this._ward = e.target.value;
                        }}"
                      />
                    </div>
                    <datalist id="wards">
                      <option>CC</option>
                      <option>SALA VERMELHA</option>
                      <option>SALA AMARELA</option>
                      <option>SALA VERDE</option>
                      <option>CO</option>
                      <option>CONSULTÓRIO</option>
                      <option>UTI 1</option>
                      <option>UTI 2</option>
                      <option>UTI CIRURG</option>
                      <option>CHD</option>
                      <option>UTI CARDIO</option>
                      <option>ENF INTERMEDIARIO</option>
                      <option>ENF 1A</option>
                      <option>ENF 1B</option>
                      <option>ENF 1C</option>
                      <option>ENF 2A</option>
                      <option>ENF 2B</option>
                      <option>ENF 2C</option>
                      <option>ENF 3A</option>
                      <option>ENF 3B</option>
                      <option>ENF 3C</option>
                      <option>ENF 4A</option>
                      <option>ENF 4B</option>
                      <option>ENF 4C</option>
                    </datalist>
                  </div>
                </div>
                <div
                  class="field is-flex 
                  is-flex-grow-1 is-horizontal"
                >
                  <div class="field-label is-normal">
                    <label class="label">Leito</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <input
                        class="input"
                        id="bed"
                        type="text"
                        .value="${this._bed}"
                        @input="${e => {
                          this._bed = e.target.value;
                        }}"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="field is-flex 
                is-flex-direction-row
                is-justify-content-space-between"
              >
                <div
                  class="field is-flex 
                  is-flex-grow-1 is-horizontal"
                >
                  <div class="field-label is-normal">
                    <label class="label">Destino</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <input
                        class="input"
                        id="destWard"
                        name="destWard"
                        list="wards"
                        type="text"
                        placeholder="Setor de Destino"
                        .value="${this._destWard}"
                        @blur="${e => {
                          this._destWard = e.target.value;
                        }}"
                      />
                    </div>
                  </div>
                </div>
                <div
                  class="field is-flex 
                  is-flex-grow-1 is-horizontal"
                >
                  <div class="field-label is-normal">
                    <label class="label">Leito</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <input
                        class="input"
                        id="destBed"
                        type="text"
                        .value="${this._destBed}"
                        @input="${e => {
                          this._destBed = e.target.value;
                        }}"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- procedure type dropdown search -->
              <div
                class="dropdown is-expanded 
                ${classMap({
                  'is-active': this._activateProcTypeSearchDropDown,
                })}"
              >
                <div class="dropdown-trigger">
                  <div class="field is-horizontal">
                    <div class="field-label is-normal">
                      <label><b>Procedimento</b></label>
                    </div>
                    <div class="field-body">
                      <div class="field">
                        <div class="control is-expanded has-icons-right">
                          <input
                            class="input"
                            type="search"
                            @input="${this._searchProcType}"
                            .value="${this._procTypeDescr}"
                            placeholder="buscar pelo nome"
                            required
                          />
                          <icon-search></icon-search>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="dropdown-menu" id="dropdown-menu" role="menu">
                  <div class="dropdown-content">
                    ${
                      this.proctypes
                        ? this.proctypes.map(
                            p => html`
                              <a
                                href="#"
                                class="dropdown-item"
                                @click="${e => {
                                  e.preventDefault();
                                  this._procTypeSelected(p);
                                }}"
                                @keydown="${e => {
                                  e.preventDefault();
                                  this._procTypeSelected(p);
                                }}"
                                ><small
                                  >${p.descr.length < 80
                                    ? p.descr
                                    : `${p.descr.substring(0, 77)}...`}</small
                                ></a
                              >
                            `
                          )
                        : html`<p></p>`
                    }
                  </div>
                </div>
              </div>
              <p
                class="has-text-danger ${classMap({
                  'is-hidden': !this._showRequiredSurgReport,
                })}"
              >
                Este procedimento necessita de ficha operatória no prontuário
              </p>
              <br />
              <br />
              <!-- surgery cancelation and reason -->
              <div
                class="field
                is-flex is-flex-direction-row
                is-justify-content-space-between 	
                is-align-content-center
                "
              >
                <div
                  class="field  
                  is-horizontal"
                >
                  <label class="checkbox">
                    <input
                      id="wasCanceled"
                      type="checkbox"
                      ?checked="${this._wasCanceled}"
                      @click="${e => {
                        this._wasCanceled = e.target.checked;
                      }}"
                    />
                    <b>Foi cancelada?</b>
                  </label>
                </div>
                <fieldset ?disabled="${!this._wasCanceled}">
                  <div
                    class="field  
                    is-horizontal"
                  >
                    <div class="field-label is-normal
                      is-flex is-flex-grow-0">
                      <label class="label">Motivo</label>
                    </div>
                    <div class="field-body is-flex">
                      <div class="field">
                        <input
                          class="input"
                          id="cancelationReason"
                          list="cancelationReasons"
                          type="text"
                          placeholder=""
                          .value="${this._cancelationReason}"
                          @blur="${e => {
                            this._cancelationReason = e.target.value;
                          }}"
                        />
                        <datalist id="cancelationReasons">
                          <option value="Falta de cirurgião"></option>
                          <option value="Falta de anestesista"></option>
                          <option value="Falta de enfermeiro"></option>
                          <option value="Falta de técnico de enfermagem"></option>
                          <option value="Falta de exames"></option>
                          <option value="Falta de hemoderivados"></option>
                          <option value="Falta de jejum"></option>
                          <option value="Falta de material para o procedimento"></option>
                          <option value="Falta de vaga UTI"></option>
                          <option value="Falta de vaga CRPA"></option>
                          <option value="Falta de TCLE"></option>
                          <option value="Prioridade para Cir. Urgência"></option>
                          <option value="Mudança de conduta médica"></option>
                          <option value="Contra indicação anestésica"></option>
                          <option value="Óbito"></option>
                          <option value="Tempo cirúrgico excedido"></option>
                          <option value="Transferência para outro Hospital"></option>
                        </datalist>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div
                class="is-flex is-flex-direction-row
                is-justify-content-space-between"
              >
                <div class="field is-horizontal">
                  <div class="field-label is-normal">
                    <label><b>Início</b></label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <input
                        class="input"
                        id="procstartdatetime"
                        type="datetime-local"
                        .value="${this._currentProcStartDateTime}"
                        @input="${e => {
                          this._currentProcStartDateTime = e.target.value;
                        }}"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div class="field is-horizontal">
                  <div class="field-label is-normal">
                    <label><b>Fim</b></label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <input
                        class="input"
                        id="procenddatetime"
                        type="datetime-local"
                        .value="${this._currentProcEndDateTime}"
                        @input="${e => {
                          this._currentProcEndDateTime = e.target.value;
                        }}"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- surgicalComplexity and typeOfSurgery -->
              <div
                class="field
                is-flex is-flex-direction-row
                is-justify-content-space-between 	
                "
              >
                <div
                  class="field is-flex 
                  is-flex-grow-1 is-horizontal"
                >
                  <div class="field-label is-normal">
                    <label class="label">Porte</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <input
                        class="input"
                        id="surgicalComplexity"
                        list="surgicalComplexityDegrees"
                        type="text"
                        placeholder="Porte"
                        .value="${this._surgicalComplexity}"
                        @blur="${e => {
                          this._surgicalComplexity = e.target.value;
                        }}"
                      />
                      <datalist id="surgicalComplexityDegrees">
                        <option value="Pequeno porte"></option>
                        <option value="Médio porte"></option>
                        <option value="Grande porte"></option>
                      </datalist>
                    </div>
                  </div>
                </div>
                <div
                  class="field is-flex
                  is-flex-grow-2 is-horizontal"
                >
                  <div class="field-label is-normal">
                    <label class="label">Tipo</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <input
                        class="input"
                        id="typeOfSurgery"
                        name="typeOfSurgery"
                        list="surgeryTypes"
                        type="text"
                        placeholder="Tipo de cirurgia"
                        .value="${this._typeOfSurgery}"
                        @blur="${e => {
                          this._typeOfSurgery = e.target.value;
                        }}"
                      />
                      <datalist id="surgeryTypes">
                        <option value="Eletiva - Ambulatorial"></option>
                        <option value="Eletiva - Hospital Dia"></option>
                        <option value="Eletiva - Internado"></option>
                        <option value="Urgência/Emergência"></option>
                      </datalist>
                    </div>
                  </div>
                </div>
              </div>
              <!-- contamination risk / antibiotics use -->
              <div
                class="field
                is-flex is-flex-direction-row
                is-justify-content-space-between 	
                "
              >
                <div
                  class="field  
                  is-horizontal"
                >
                  <div class="field-label is-normal
                    is-flex is-flex-grow-0">
                    <label class="label">Contaminação</label>
                  </div>
                  <div class="field-body is-flex">
                    <div class="field">
                      <input
                        class="input"
                        id="contaminationRisk"
                        list="contaminationRiskTypes"
                        type="text"
                        placeholder=""
                        .value="${this._contaminationRisk}"
                        @blur="${e => {
                          this._contaminationRisk = e.target.value;
                        }}"
                      />
                      <datalist id="contaminationRiskTypes">
                        <option value="Limpa"></option>
                        <option value="Potencialmente contaminada"></option>
                        <option value="Contaminada"></option>
                        <option value="Infectada"></option>
                      </datalist>
                    </div>
                  </div>
                </div>
                <div
                  class="field  
                  is-horizontal"
                >
                  <label class="checkbox">
                    <input
                      id="antibioticUse"
                      type="checkbox"
                      ?checked="${this._antibioticUse}"
                      @click="${e => {
                        this._antibioticUse = e.target.checked;
                      }}"
                    />
                    <b>Usou antibiótico?</b>
                  </label>
                </div>
              </div>
              <!-- surgery group and surgical room  -->
              <div
                class="field
                is-flex is-flex-direction-row
                is-justify-content-space-between 	
                "
              >
                <div
                  class="field  
                  is-horizontal"
                >
                  <div class="field-label is-normal
                    is-flex is-flex-grow-0">
                    <label class="label">Grupo</label>
                  </div>
                  <div class="field-body is-flex">
                    <div class="field">
                      <input
                        class="input"
                        id="procGroup"
                        list="proceduresGroups"
                        type="text"
                        placeholder="Grupo de procedimento"
                        .value="${this._procGroup}"
                        @blur="${e => {
                          this._procGroup = e.target.value;
                        }}"
                      />
                      <datalist id="proceduresGroups">
                        <option value="CG - Biópsias"></option>
                        <option value="CG - Colectomias"></option>
                        <option value="CG - Enterectomias"></option>
                        <option value="CG - Esofagectomias"></option>
                        <option value="CG - Gastrectomias"></option>
                        <option value="CG - Hepatectomias"></option>
                        <option value="CG - Pancreatectomias"></option>
                        <option value="CG - Parede Abdominal"></option>
                        <option value="CG - Vesícula e Vias Biliares"></option>
                        <option value="NC - Aneurisma Cerebral"></option>
                        <option value="NC - Biópsias"></option>
                        <option value="NC - Bloqueios"></option>
                        <option value="NC - Cirurgia de Coluna"></option>
                        <option value="NC - Cranioplastia"></option>
                        <option
                          value="NC - Derivações/Ventriculostomia (DVE/DVP)"
                        ></option>
                        <option
                          value="NC - Descompressão/Drenagem de Hematoma"
                        ></option>
                        <option value="NC - Fístulas e Malformações"></option>
                        <option value="NC - Tumor Cerebral"></option>
                      </datalist>
                    </div>
                  </div>
                </div>
                <div
                  class="field  
                  is-horizontal"
                >
                  <div class="field-label is-normal
                    is-flex is-flex-grow-0">
                    <label class="label">Sala</label>
                  </div>
                  <div class="field-body is-flex">
                    <div class="field">
                      <input
                        class="input"
                        id="surgicalRoom"
                        list="surgicalRooms"
                        type="text"
                        placeholder="Sala"
                        .value="${this._surgicalRoom}"
                        @blur="${e => {
                          this._surgicalRoom = e.target.value;
                        }}"
                      />
                      <datalist id="surgicalRooms">
                        <option value="Sala 01"></option>
                        <option value="Sala 02"></option>
                        <option value="Sala 03"></option>
                        <option value="Sala 04"></option>
                        <option value="Sala 05"></option>
                        <option value="Sala 06"></option>
                        <option value="Sala 07"></option>
                        <option value="Sala 08"></option>
                        <option value="Sala 09"></option>
                        <option value="Sala 10"></option>
                      </datalist>
                    </div>
                  </div>
                </div>
              </div>
              <div class="field is-horizontal is-flex">
                <div class="field-label is-normal
                  is-flex is-flex-grow-0">
                  <label class="label">Equipe</label>
                </div> 
                <div class="field-body is-flex">
                  <div class="field">
                    <input
                      class="input"
                      id="team"
                      name="team"
                      list="teams"
                      type="text"
                      placeholder="Equipe"
                      .value="${this._team}"
                      @blur="${e => {
                        this._team = e.target.value;
                      }}"
                      required
                    />

                    <datalist id="teams">
                      <option value="Anestesiologia">Anestesiologia</option>
                      <option value="Broncoscopia">Broncoscopia</option>
                      <option value="Cardiologia">Cardiologia</option>
                      <option value="Cir. Buco-maxilo-facial">
                        Cir. Buco-maxilo-facial
                      </option>
                      <option value="Cirurgia Cabeça e Pescoço">
                        Cirurgia Cabeça e Pescoço
                      </option>
                      <option value="Cirurgia Geral">Cirurgia Geral</option>
                      <option value="Cirurgia Oncológica">
                        Cirurgia Oncológica
                      </option>
                      <option value="Cirurgia Pediátrica">
                        Cirurgia Pediátrica
                      </option>
                      <option value="Cirurgia Plástica">
                        Cirurgia Plástica
                      </option>
                      <option value="Cirurgia Torácica">
                        Cirurgia Torácica
                      </option>
                      <option value="Cirurgia Vascular">
                        Cirurgia Vascular
                      </option>
                      <option value="Endocrinologia">Endocrinologia</option>
                      <option value="Gastroenterologia">
                        Gastroenterologia
                      </option>
                      <option value="Ginecologia">Ginecologia</option>
                      <option value="Mastologia">Mastologia</option>
                      <option value="Nefrologia (Vascular)">
                        Nefrologia (Vascular)
                      </option>
                      <option value="Neurocirurgia">Neurocirurgia</option>
                      <option value="Neuroclínica">Neuroclínica</option>
                      <option value="Obstetrícia">Obstetrícia</option>
                      <option value="Odontologia">Odontologia</option>
                      <option value="Oftalmologia">Oftalmologia</option>
                      <option value="Ortopedia">Ortopedia</option>
                      <option value="Proctologia">Proctologia</option>
                      <option value="Transplante Renal">
                        Transplante Renal
                      </option>
                      <option value="Transplante Hepático">
                        Transplante Hepático
                      </option>
                      <option value="Urologia">Urologia</option>
                    </datalist>
                  </div>
                </div>
              </div>
              <br />
              <!-- users dropdown search -->
              <div class="card">
                <div class="card-content">
                  <div class="content">
                    <div
                      class="dropdown is-up is-expanded ${classMap({
                        'is-active': this._activateUserSearchDropDown,
                      })}"
                    >
                      <div class="dropdown-trigger">
                        <div class="field is-horizontal">
                          <div class="field-label is-normal">
                            <label><b>Executante(s)</b></label>
                          </div>
                          <div class="field-body">
                            <div class="field">
                              <div class="control is-expanded has-icons-right">
                                <input
                                  id="procusers"
                                  class="input"
                                  type="search"
                                  @input="${this._searchUser}"
                                  .value="${this._userName}"
                                  placeholder="buscar pelo nome ou registro de classe"
                                />
                                <icon-search></icon-search>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        class="dropdown-menu"
                        id="dropdown-users"
                        role="menu"
                      >
                        <div class="dropdown-content">
                          ${
                            this.users
                              ? this.users.map(
                                  u => html` <a
                                    href="#"
                                    class="dropdown-item"
                                    @click="${e => {
                                      e.preventDefault();
                                      this._userSelected(u);
                                    }}"
                                    @keydown="${e => {
                                      e.preventDefault();
                                      this._userSelected(u);
                                    }}"
                                  >
                                    ${u.name} - ${u.licenceNumber}
                                  </a>`
                                )
                              : html`<p></p>`
                          }
                        </div>
                      </div>
                    </div>
                    <div>
                      ${
                        this._currentProcUsers
                          ? this._currentProcUsers.map(
                              (u, i) =>
                                html`
                                  <div
                                    class="is-flex 
                                    is-flex-direction-row
                                      is-justify-content-space-between
                                        is-align-items-center
                                          has-background-light"
                                  >
                                    <div class="pl-2">
                                      ${u.name} - ${u.profBoardName} - n.:
                                      ${u.licenceNumber}
                                    </div>
                                    <button
                                      class="button is-light"
                                      @click="${e => {
                                        e.preventDefault();
                                        this._removeProcUser(i);
                                      }}"
                                    >
                                      <icon-trash></icon-trash>
                                    </button>
                                  </div>
                                `
                            )
                          : html`<p></p> `
                      }
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <!-- circulating nurse dropdown search -->
              <div
                class="is-flex
                is-flex-direction-row"
              >
                <div
                  class="dropdown 
                  ${classMap({
                    'is-active': this._activateCirculatingNurseSearchDropDown,
                  })}"
                >
                  <div class="field is-flex-grow-5 is-horizontal">
                    <div
                      style="padding-right: 20px; padding-top: 8px;"
                      class="label is-normal"
                    >
                      <label><b>Circulante</b></label>
                    </div>
                    <div class="field-body">
                      <div class="dropdown-trigger">
                        <div class="field">
                          <div class="control is-expanded has-icons-right">
                            <input
                              class="input"
                              type="search"
                              @input="${this._searchCirculatingNurse}"
                              .value="${this._circulatingNurseName}"
                              placeholder="buscar pelo nome ou Coren"
                            />
                            <icon-search></icon-search>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="dropdown-menu" id="dropdown-nurse" role="menu">
                    <div class="dropdown-content">
                      ${
                        this.users
                          ? this.users.map(
                              u => html` <a
                                href="#"
                                class="dropdown-item"
                                @click="${e => {
                                  e.preventDefault();
                                  this._circulatingNurseSelected(u);
                                }}"
                                @keydown="${e => {
                                  e.preventDefault();
                                  this._circulatingNurseSelected(u);
                                }}"
                                >${u.name} - Reg: ${u.licenceNumber}
                              </a>`
                            )
                          : html`<p></p>`
                      }
                    </div>
                  </div>
                </div>
              </div>
              <p><b>Anestesia</b></p>
            </br>
              <!-- Anesthesia type and subtype-->
              <div
                class="field
                is-flex is-flex-direction-row
                is-justify-content-space-between 	
                "
              >
                <div class="field 
                  is-horizontal">
                  <div class="field-label is-normal">
                    <label class="label">Tipo</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <input
                        class="input"
                        id="anesthesiaType"
                        list="anesthesiaTypes"
                        type="text"
                        placeholder="Tipo de Anestesia"
                        .value="${this._anesthesiaType}"
                        @blur="${e => {
                          this._anesthesiaType = e.target.value;
                        }}"
                      />
                      <datalist id="anesthesiaTypes">
                        <option value="Anestesia Geral"></option>
                        <option value="Anestesia Local"></option>
                        <option value="Anestesia Regional"></option>
                        <option value="Sedação"></option>
                      </datalist>
                    </div>
                  </div>
                </div>
                <div class="field  
                  is-horizontal">
                  <div class="field-label is-normal">
                    <label class="label">Subtipo</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <input
                        class="input"
                        id="anesthesiaSubType"
                        name="anesthesiaSubType"
                        list="anesthesiaSubTypes"
                        type="text"
                        placeholder="Subtipo de Anestesia"
                        .value="${this._anesthesiaSubType}"
                        @blur="${e => {
                          this._anesthesiaSubType = e.target.value;
                        }}"
                      />
                      <datalist id="anesthesiaSubTypes">
                        <option value="Anestesia Raquidiana"></option>
                        <option value="Anestesia Epidural"></option>
                        <option value="Anestesia Sequencial"></option>
                        <option value="Bloqueio de Nervo Periféfico"></option>
                      </datalist>
                    </div>
                  </div>
                </div>
              </div>
              <div class="field is-flex 
                is-flex-grow-2 is-horizontal">
                <div class="field-label is-normal
                  is-flex is-flex-grow-0">
                  <label class="label">ASA</label>
                </div> 
                <div class="field-body">
                  <div class="field">
                    <input
                      class="input"
                      id="riskClassASA"
                      name="riskClassASA"
                      list="riskClassesASA"
                      type="text"
                      placeholder="Classificação ASA"
                      .value="${this._riskClassASA}"
                      @blur="${e => {
                        this._riskClassASA = e.target.value;
                      }}"
                    />
                    <datalist id="riskClassesASA">
                      <option>ASA I</option>
                      <option>ASA II</option>
                      <option>ASA III</option>
                      <option>ASA IV</option>
                      <option>ASA V</option>
                      <option>ASA VI</option>
                    </datalist>
                  </div>
                </div>
              </div>
              <div
                class="is-flex is-flex-direction-row
                is-justify-content-space-between"
              >
                <div class="field is-horizontal">
                  <div class="field-label is-normal">
                    <label><b>Início</b></label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <input
                        class="input"
                        id="aneststartdatetime"
                        type="datetime-local"
                        .value="${this._currentAnestStartDateTime}"
                        @input="${e => {
                          this._currentAnestStartDateTime = e.target.value;
                        }}"
                      />
                    </div>
                  </div>
                </div>
                <div class="field is-horizontal">
                  <div class="field-label is-normal">
                    <label><b>Fim</b></label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <input
                        class="input"
                        id="anestenddatetime"
                        type="datetime-local"
                        .value="${this._currentAnestEndDateTime}"
                        @input="${e => {
                          this._currentAnestEndDateTime = e.target.value;
                        }}"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- anesthesiologists dropdown search -->
              <div class="card">
                <div class="card-content">
                  <div class="content">
                    <div
                      class="dropdown is-up is-expanded ${classMap({
                        'is-active':
                          this._activateAnesthesiologistSearchDropDown,
                      })}"
                    >
                      <div class="dropdown-trigger">
                        <div class="field is-horizontal">
                          <div class="field-label is-normal">
                            <label><b>Anestesista(s)</b></label>
                          </div>
                          <div class="field-body">
                            <div class="field">
                              <div class="control is-expanded has-icons-right">
                                <input
                                  id="procanest"
                                  class="input"
                                  type="search"
                                  @input="${this._searchAnesthesiologist}"
                                  .value="${this._anesthesiologistName}"
                                  placeholder="buscar pelo nome ou CRM"
                                />
                                <icon-search></icon-search>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        class="dropdown-menu"
                        id="dropdown-anest"
                        role="menu"
                      >
                        <div class="dropdown-content">
                          ${
                            this.users
                              ? this.users.map(
                                  u => html` <a
                                    href="#"
                                    class="dropdown-item"
                                    @click="${e => {
                                      e.preventDefault();
                                      this._anesthesiologistSelected(u);
                                    }}"
                                    @keydown="${e => {
                                      e.preventDefault();
                                      this._anesthesiologistSelected(u);
                                    }}"
                                  >
                                    ${u.name} - ${u.licenceNumber}
                                  </a>`
                                )
                              : html`<p></p>`
                          }
                        </div>
                      </div>
                    </div>
                    <div>
                      ${
                        this._currentProcAnesthesiologists
                          ? this._currentProcAnesthesiologists.map(
                              (u, i) =>
                                html`
                                  <div
                                    class="is-flex 
                                    is-flex-direction-row
                                      is-justify-content-space-between
                                        is-align-items-center
                                          has-background-light"
                                  >
                                    <div class="pl-2">
                                      ${u.name} - ${u.profBoardName} - n.:
                                      ${u.licenceNumber}
                                    </div>
                                    <button
                                      class="button is-light"
                                      @click="${e => {
                                        e.preventDefault();
                                        this._removeProcAnesthesiologist(i);
                                      }}"
                                    >
                                      <icon-trash></icon-trash>
                                    </button>
                                  </div>
                                `
                            )
                          : html`<p></p> `
                      }
                    </div>
                  </div>
                </div>
              </div>
          </br>
              <div class="field is-horizontal is-flex">
                <div class="field-label is-normal
                  is-flex is-flex-grow-0">
                  <label class="label">Obs.:</label>
                </div> 
                <div class="field-body is-flex">
                  <div class="field">
                    <textarea
                      class="textarea"
                      id="notes"
                      name="notes"
                      maxlength="2000"
                      placeholder="Observações"
                      .value="${this._notes}"
                      @blur="${e => {
                        this._notes = e.target.value;
                      }}"
                    ></textarea>
                  </div>
                </div>
              </div>
              <br />
              <div
                class="field is-flex is-flex-direction-row
                is-justify-content-space-around"
              >
                <button class="button is-success" @click="${this._saveForm}">
                  Gravar
                </button>
                <button class="button" @click="${this._closeForm}">
                  Cancelar/Limpar
                </button>
              </div>
        </form>
      </div>
        </div>
      </section>
    `;
  }
}
