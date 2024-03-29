/* eslint-disable lit-a11y/anchor-is-valid */
import { installRouter } from 'pwa-helpers/router.js';
import { LitElement, html } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { DateTime } from 'luxon';
import sheets from './utilities/sheets.js';
import './icons/icon-user.js';

export class CollectClient extends LitElement {
  // use lightDOM
  createRenderRoot() {
    return this;
  }

  static get properties() {
    return {
      // procedures
      _procsres: { type: Object, state: true },
      _procedures: { type: Array, state: true },
      _currentProcedure: { type: Object, state: true },
      _currentProceduresDate: { type: String, state: true },
      _showProcedureEdit: { type: Boolean, state: true },
      _editProcedureMode: { type: Boolean, state: true },
      // procedures types
      _proceduresTypes: { type: Array, state: true },
      _procTypesRes: { type: Object, state: true },
      _currentEditProcType: { type: Object, state: true },
      _showProcTypeForm: { type: Boolean, state: true },
      // users
      _user: { type: Object },
      _usersres: { type: Object, state: true },
      _users: { type: Array, state: true },
      _showUserForm: { type: Boolean, state: true },
      _showUserProfileForm: { type: Boolean, state: true },
      _currentEditUser: { type: Object, state: true },
      _loggedIn: { type: Boolean, state: true },
      _isAdmin: { type: Boolean, state: true },
      // patients
      _patientsRes: { type: Object, state: true },
      _patients: { type: Array, state: true },
      _currentEditPatient: { type: Object, state: true },
      _showPatientForm: { type: Boolean, state: true },
      _page: { type: String, state: true },
      _burgerActive: { type: Boolean, state: true },
      _toggleModal: { type: Boolean, state: true },
      _modalMsg: { type: String, state: true },
      _spinnerHidden: { type: Boolean, state: true },
      _adminDropDownOpen: { type: Boolean, state: true },
      _toggleResetPwModal: { type: Boolean, state: true },
      _toggleConfirmationModal: { type: Boolean, state: true },
      _confirmationModalMsg: { type: String, state: true },
      _confirmModalObject: { type: Object, state: true },
      _confirmModalFunction: { type: Function },
      _timestamp: { type: Object, state: true },
    };
  }

  constructor() {
    super();
    this.client = {};
    this.rest = {};
    this._page = 'home';
    this._burgerActive = false;
    this._user = null;
    this._loggedIn = false;
    this._isAdmin = false;
    this._toggleModal = false;
    this._modalMsg = '';
    this._procedures = null;
    this._spinnerHidden = true;
    this._currentProcedure = null;
    this._currentProceduresDate = '';
    this._adminDropDownOpen = false;
    this._users = [];
    this._currentEditUser = {};
    this._toggleResetPwModal = false;
    this._proceduresTypes = [];
    this._currentEditProcType = {};
    this._showUserForm = false;
    this._showUserProfileForm = false;
    this._showProcTypeForm = false;
    this._toggleConfirmationModal = false;
    this._confirmationModalMsg = '';
    this._confirmModalObject = {};
    this._confirmModalFunction = () => {};
  }

  firstUpdated() {
    installRouter(location => this._locationChanged(location));
    // grab the global feathers object imported on index.html
    this.client = window.feathers();

    if (window.location.host.toString().includes('localhost')) {
      this.rest = window.feathers.rest('http://localhost:3030');
    } else {
      this.rest = window.feathers.rest(`${window.location.href}api`);
    }
    this.client.configure(this.rest.superagent(window.superagent));
    this.client.configure(
      window.feathers.authentication({
        storage: window.storage,
      })
    );

    // add event listeners
    this.addEventListener('login', this._handleLoginEvent);

    // Procedures
    this._editProcedureMode = false;
    this.addEventListener('update-procedures-list', this._updateProceduresList);
    this.addEventListener('edit-procedure', this._editProcedure);
    this.addEventListener('remove-procedure', this._removeProcedure);
    this.addEventListener('save-procedure-form', this._saveProcedure);
    this.addEventListener('close-procedure-edit', () => {
      this._currentProcedure = null;
      this._showProcedureEdit = false;
    });
    this.addEventListener('close-procedure-form', () => {
      this._currentProcedure = null;
      this._editProcedureMode = false;
      // this._showProcedureEdit = false;
    });

    // Users
    this.addEventListener('update-users-list', this._updateUsersList);
    this.addEventListener('search-user', this._searchUser);
    this.addEventListener('edit-user', this._editUser);
    this.addEventListener('save-user-profile', this._saveUserProfile);
    this.addEventListener('add-user', this._loadShowUserForm);
    this.addEventListener('save-user-form', this._saveUser);
    this.addEventListener('close-user-form', () => {
      this._currentEditUser = {};
      this._showUserForm = false;
    });
    this.addEventListener('close-user-profile-form', () => {
      this._currentEditUser = {};
      this._showUserProfileForm = false;
    });

    // patients
    this.addEventListener('update-patients-list', this._updatePatientsList);
    this.addEventListener('search-patient', this._searchPatient);
    this.addEventListener('remove-patient', this._removePatient);
    this.addEventListener('edit-patient', this._editPatient);
    this.addEventListener('add-patient', this._loadShowPatientForm);
    this.addEventListener('save-patient-form', this._savePatient);
    this.addEventListener('close-patient-form', () => {
      this._currentEditPatient = null;
      this._showPatientForm = false;
    });

    // procedures types
    this.addEventListener(
      'update-procedures-types-list',
      this._updateProcTypesList
    );
    this.addEventListener('edit-procedure-type', this._editProcType);
    this.addEventListener('search-procedure-type', this._searchProcType);
    this.addEventListener('remove-procedure-type', this._removeProcType);
    this.addEventListener('add-procedure-type', this._loadShowProcTypeForm);
    this.addEventListener('save-procedure-type-form', this._saveProcType);
    this.addEventListener('close-procedure-type-form', () => {
      this._currentEditProcType = null;
      this._showProcTypeForm = false;
    });

    // add spinner event listeners
    // dynamically load otw-spinner if neccessary
    this.addEventListener('show-spinner', () => {
      if (typeof customElements.get('spinner-loader') === 'undefined') {
        import('./spinner-loader.js').then(() => {
          this._spinnerHidden = false;
        });
      } else {
        this._spinnerHidden = false;
      }
    });
    this.addEventListener('hide-spinner', () => {
      this._spinnerHidden = true;
    });

    // add modal message event listener
    this.addEventListener('show-modal-message', this._showModalMessage);
  }

  _showModalMessage(e) {
    if (e.detail && e.detail.msg) {
      this._modalMsg = e.detail.msg;
      this._toggleModal = true;
    }
  }

  async _handleLoginEvent(e) {
    this.dispatchEvent(new CustomEvent('show-spinner'));
    const data = { ...e.detail };
    try {
      const auth = await this._login(data.username, data.password);
      this._timestamp = DateTime.fromMillis(
        (await this.client.service('sys').get('timestamp')).timestamp
      );
      this._user = { ...auth.user };
      if (!this._user.isLoginEnabled) {
        // show msg and call logout
        this._modalMsg = 'Este usuário não está autorizado!';
        this._toggleModal = true;
        this._logoutClicked();
      }
      this._spinnerHidden = true;
      this._isAdmin = this._user.isAdmin === 1;
      this._loggedIn = true;
      window.history.pushState({}, '', '/procform');
      this._locationChanged(window.location);
      if (this._user.changePassword) {
        this._confirmModalObject = {};
        this._confirmModalFunction = this._editCurrentUser;
        this._toggleConfirmationModal = true;
        this._confirmationModalMsg = 'Quer atualizar sua senha agora?';
      }
    } catch (err) {
      this._spinnerHidden = true;
      // eslint-disable-next-line no-console
      // console.log(err.message);
      this._modalMsg = `Ocorreu um erro: ${err.message}`;
      this._toggleModal = true;
    }
  }

  _editCurrentUser() {
    this._currentEditUser = { ...this._user };
    this._loadEditUserProfile();
  }

  _login(username, password) {
    return this.client.authenticate({
      strategy: 'local',
      username,
      password,
    });
  }

  async _logoutClicked() {
    try {
      await this.client.logout();
      this._user = null;
      this._loggedIn = false;
      this._isAdmin = false;
      this.requestUpdate();
      window.history.pushState({}, '', '/');
      this._locationChanged(window.location);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  _locationChanged(location) {
    const path = window.decodeURIComponent(location.pathname);
    const page = path === '/' ? 'home' : path.slice(1);
    this._loadPage(page);
  }

  _loadPage(page) {
    let p = page;
    switch (p) {
      case 'loginform':
        if (typeof customElements.get('login-form') === 'undefined') {
          import('./login-form.js').catch(e => {
            // eslint-disable-next-line no-console
            console.log(e);
          });
        }
        break;
      case 'procedit':
        if (typeof customElements.get('proc-form') === 'undefined') {
          import('./proc-form.js').then(() => {});
        }
        break;
      case 'procform':
        this._editProcedureMode = false;
        this._currentProcedure = null;
        if (typeof customElements.get('proc-form') === 'undefined') {
          import('./proc-form.js');
        }
        break;
      case 'procsview':
        this.dispatchEvent(
          new CustomEvent('close-procedure-form', {
            bubbles: true,
            composed: true,
          })
        );
        if (typeof customElements.get('procs-view') === 'undefined') {
          import('./procs-view.js').catch(e => {
            // eslint-disable-next-line no-console
            console.log(e);
          });
        } else {
          this.dispatchEvent(new CustomEvent('update-procedures-list'));
        }
        break;
      case 'ptsview':
        if (typeof customElements.get('patients-view') === 'undefined') {
          import('./patients-view.js').catch(e => {
            // eslint-disable-next-line no-console
            console.log(e);
          });
        } else {
          this.dispatchEvent(new CustomEvent('update-procedures-list'));
        }
        break;
      case 'usersview':
        if (typeof customElements.get('users-view') === 'undefined') {
          import('./users-view.js').catch(e => {
            // eslint-disable-next-line no-console
            console.log(e);
          });
        } else {
          this.dispatchEvent(new CustomEvent('update-users-list'));
        }
        break;
      case 'procedurestypesview':
        if (typeof customElements.get('proctypes-view') === 'undefined') {
          import('./proctypes-view.js').catch(e => {
            // eslint-disable-next-line no-console
            console.log(e);
          });
        } else {
          this.dispatchEvent(new CustomEvent('update-procedures-types-list'));
        }
        break;
      default:
        p = '/';
    }
    this._page = p;
  }

  _navBarBurgerClicked() {
    this._burgerActive = !this._burgerActive;
  }

  //
  // Procedures
  //

  async _updateProceduresList(e) {
    if (this._user.isLoginEnabled) {
      // eslint-disable-next-line no-console
      // console.log('updating procedures list ...');
      // eslint-disable-next-line no-console
      // console.log(JSON.stringify(e.detail, null, 2));
      this._spinnerHidden = false;
      let skip = 0;
      if (e.detail && e.detail.skip) {
        skip = e.detail.skip;
      }
      // defaults to today's procedures
      let startDateTime = DateTime.local().startOf('day');
      let endDateTime = DateTime.local().endOf('day');

      if (e.detail && e.detail.searchByDate === 'day') {
        startDateTime = DateTime.fromISO(e.detail.date).startOf('day');
        endDateTime = startDateTime.endOf('day');
      }

      if (e.detail && e.detail.searchByDate === 'week') {
        startDateTime = DateTime.fromISO(e.detail.date).startOf('week');
        endDateTime = startDateTime.endOf('week');
      }

      if (e.detail && e.detail.searchByDate === 'month') {
        startDateTime = DateTime.fromISO(e.detail.date).startOf('month');
        endDateTime = startDateTime.endOf('month');
      }

      this._currentProceduresDate = startDateTime.toISODate();
      // eslint-disable-next-line no-console
      // console.log(`_currentProceduresDate: ${this._currentProceduresDate}`);
      // eslint-disable-next-line no-console
      // console.log(`startDateTime: ${startDateTime}`);
      // eslint-disable-next-line no-console
      // console.log(`endDateTime: ${endDateTime}`);
      const query = {
        $skip: skip,
        $sort: {
          procStartDateTime: 1,
        },
        procStartDateTime: {
          $gte: startDateTime.toISO(),
          $lte: endDateTime.toISO(),
        },
      };

      if (e.detail && e.detail.searchByPersonTeam === 'person') {
        const id = e.detail.searchID;
        query.$or = [
          { user1ID: id },
          { user2ID: id },
          { user3ID: id },
          { user4ID: id },
          { user5ID: id },
          { user6ID: id },
          { createdByUserID: id },
          { updatedByUserID: id },
        ];
      }
      if (e.detail && e.detail.searchByPersonTeam === 'team') {
        const team = e.detail.searchTeam;
        if (team !== 'all') {
          query.team = team;
        }
      }

      if (
        e.detail &&
        typeof e.detail.$paginate !== 'undefined' &&
        e.detail.$paginate === false
      ) {
        // console.log(e.detail);
        query.$paginate = false;
        delete query.$skip;
      }
      // console.log(JSON.stringify(query, null, 2));

      try {
        const procsList = await this.client.service('procedures').find({
          query: { ...query },
        });
        // eslint-disable-next-line no-console
        // console.log(procsList.data);
        // eslint-disable-next-line no-console
        // console.log(JSON.stringify(procsList, null, 2));
        if (typeof procsList.data !== 'undefined') {
          // we got some data
          this._procsres = { ...procsList };
          // this._procedures = [...procsList.data];
        }
        if (
          typeof procsList.data === 'undefined' &&
          e.detail &&
          typeof e.detail.$paginate !== 'undefined' &&
          e.detail.$paginate === false
        ) {
          // console.log(JSON.stringify(e.detail, null, 2));
          this._spinnerHidden = false;
          sheets([...procsList], { ...this._user });
        }
        this._spinnerHidden = true;
      } catch (err) {
        this._spinnerHidden = true;
        this._modalMsg = `Erro ao buscar lista de procedimentos: ${err}`;
        this._toggleModal = true;
      }
    }
  }

  _editProcedure(e) {
    // eslint-disable-next-line no-console
    // console.log('entering edit procedure...');
    // console.log(JSON.stringify(e.detail, null, 2));
    this._editProcedureMode = true;
    this._currentProcedure = { ...e.detail };
    // eslint-disable-next-line no-console
    // console.log(this._currentProcedure);
    window.history.pushState({}, '', '/procedit');
    this._locationChanged(window.location);
  }

  _removeProcedure(e) {
    this._confirmModalObject = { ...e.detail };
    this._confirmModalFunction = this._removeCurrentProcedure;
    this._confirmationModalMsg = `Confirma a remoção do procedimento: 
    ${e.detail.descr}, realizado por ${e.detail.user1Name}?`;
    this._toggleConfirmationModal = true;
  }

  async _removeCurrentProcedure(p) {
    if (this._user.isLoginEnabled) {
      this.dispatchEvent(new CustomEvent('show-spinner'));
      if (p.id) {
        try {
          // eslint-disable-next-line no-console
          console.log('removing procedure');
          // verify if current user isAdmin or has created this
          // procedure himself
          if (
            this._user.isAdmin ||
            this._user.id.toString() === p.createdByUserID
          ) {
            await this.client.service('procedures').remove(p.id);
            this._spinnerHidden = true;
            this._modalMsg = 'Procedimento removido com sucesso!';
            this._toggleModal = true;
            this.dispatchEvent(
              new CustomEvent('update-procedures-list', {
                bubbles: true,
                composed: true,
              })
            );
          } else {
            throw new Error('Current user can not remove this procedure');
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(`could not remove procedure: ${err}`);
        }
      } else {
        this._spinnerHidden = true;
        this._modalMsg = 'Erro ao remover o procedimento';
        this._toggleModal = true;
        this.dispatchEvent(
          new CustomEvent('update-procedures-list', {
            bubbles: true,
            composed: true,
          })
        );
        // eslint-disable-next-line no-console
        console.log(`could not remove procedure: missing id`);
      }
    }
  }

  async _saveProcedure(e) {
    if (this._user.isLoginEnabled) {
      // eslint-disable-next-line no-console
      // console.log(JSON.stringify(e.detail, null, 2));
      this._spinnerHidden = false;
      const p = { ...e.detail };
      if (p.id) {
        try {
          // eslint-disable-next-line no-console
          console.log('updating procedure');
          // remove procedure's property that must never changed
          delete p.createdByUserID;
          await this.client.service('procedures').patch(p.id, { ...p });
          this._spinnerHidden = true;
          this._modalMsg = 'Procedimento gravado com sucesso!';
          this._toggleModal = true;
          // eslint-disable-next-line no-console
          // console.log(`Procedure updated: ${JSON.stringify(res, null, 2)}`);
          this.dispatchEvent(
            new CustomEvent('update-procedures-list', {
              detail: { queryByDate: p.procStartDateTime },
              bubbles: true,
              composed: true,
            })
          );
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(`could not update procedure: ${err}`);
        }
      } else {
        try {
          // eslint-disable-next-line no-console
          console.log('creating procedure');
          await this.client.service('procedures').create({ ...p });
          this._spinnerHidden = true;
          this._modalMsg = 'Procedimento gravado com sucesso!';
          this._toggleModal = true;
          // eslint-disable-next-line no-console
          // console.log(JSON.stringify(res, null, 2));
          this.dispatchEvent(
            new CustomEvent('update-procedures-list', {
              detail: { queryByDate: p.procStartDateTime },
              bubbles: true,
              composed: true,
            })
          );
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(`could not create procedure: ${err}`);
        }
      }
    }
  }

  //
  // Users

  _editUser(e) {
    // eslint-disable-next-line no-console
    // console.log(JSON.stringify(e.detail, null, 2));
    this._currentEditUser = { ...e.detail };
    // eslint-disable-next-line no-console
    // console.log(this._currentEditUser);
    this._loadShowUserForm();
  }

  async _updateUsersList(e) {
    if (this._isAdmin && this._user.isLoginEnabled) {
      // clear users list
      this._users = [];
      // eslint-disable-next-line no-console
      // console.log('updating users list ...');
      this._spinnerHidden = false;
      let skip = 0;
      if (e.detail && e.detail.skip) {
        skip = e.detail.skip;
      }
      try {
        const usersList = await this.client.service('users').find({
          query: {
            $skip: skip,
            $sort: {
              name: 1,
            },
          },
        });
        // eslint-disable-next-line no-console
        // console.log(usersList.data);
        if (usersList.data.length > 0) {
          this._usersres = { ...usersList };
          this._users = [...usersList.data];
        }
        this._spinnerHidden = true;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(err.message));
        this._spinnerHidden = true;
        this._modalMsg = 'Erro ao buscar lista de usuários';
        this._toggleModal = true;
      }
    }
  }

  _loadShowUserForm() {
    // dynamically load user-form if neccessary
    if (typeof customElements.get('user-form') === 'undefined') {
      import('./user-form.js').then(() => {
        this._showUserForm = true;
      });
    } else {
      this._showUserForm = true;
    }
  }

  _loadEditUserProfile() {
    // dynamically load user-form if neccessary
    if (typeof customElements.get('user-profile-form') === 'undefined') {
      import('./uprofile-form.js').then(() => {
        this._showUserProfileForm = true;
      });
    } else {
      this._showUserProfileForm = true;
    }
  }

  async _saveUserProfile(e) {
    this._spinnerHidden = false;
    const u = { ...e.detail };
    // eslint-disable-next-line no-console
    // console.log(`user: ${JSON.stringify(u,null,2)}`);
    if (u.id) {
      try {
        // eslint-disable-next-line no-console
        console.log('updating user');
        await this.client.service('users').patch(u.id, { ...u });
        this._spinnerHidden = true;
        this._modalMsg = 'Perfil atualizado com sucesso!';
        this._toggleModal = true;
        // eslint-disable-next-line no-console
        // console.log(`User updated: ${JSON.stringify(res, null, 2)}`);
        this.dispatchEvent(
          new CustomEvent('update-users-list', {
            bubbles: true,
            composed: true,
          })
        );
        // if it is a regular user updating its profile
        // go to homepage
        window.history.pushState({}, '', '/home');
        this._locationChanged(window.location);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(`could not update user: ${err}`);
      }
    }
  }

  async _saveUser(e) {
    if (this._isAdmin && this._user.isLoginEnabled) {
      // eslint-disable-next-line no-console
      // console.log(JSON.stringify(e.detail, null, 2));
      this._spinnerHidden = false;
      const u = { ...e.detail };
      if (u.id) {
        try {
          // eslint-disable-next-line no-console
          console.log('updating user');
          await this.client.service('users').patch(u.id, { ...u });
          this._spinnerHidden = true;
          this._modalMsg = 'Usuário gravado com sucesso!';
          this._toggleModal = true;
          // eslint-disable-next-line no-console
          // console.log(`User updated: ${JSON.stringify(res, null, 2)}`);
          this.dispatchEvent(
            new CustomEvent('update-users-list', {
              bubbles: true,
              composed: true,
            })
          );
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(`could not update user: ${err}`);
        }
      } else {
        try {
          // eslint-disable-next-line no-console
          // console.log('creating user');
          await this.client.service('users').create({ ...u });
          this._spinnerHidden = true;
          this._modalMsg = 'Usuário gravado com sucesso!';
          this._toggleModal = true;
          // eslint-disable-next-line no-console
          // console.log(JSON.stringify(res, null, 2));
          this.dispatchEvent(
            new CustomEvent('update-users-list', {
              bubbles: true,
              composed: true,
            })
          );
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(`could not create user: ${err}`);
        }
      }
    }
  }

  async _searchUser(e) {
    if (this._user.isLoginEnabled) {
      this._users = [];
      // eslint-disable-next-line no-console
      // console.log(`searching for users: ${e.detail}`);
      this._spinnerHidden = false;
      let skip = 0;
      if (e.detail && e.detail.skip) {
        skip = e.detail.skip;
      }
      let isListingEnabled = {};
      if (e.detail && e.detail.allUsers) {
        isListingEnabled = {
          $in: [0, 1],
        };
      } else {
        isListingEnabled = {
          $ne: 0,
        };
      }
      let search = '';
      if (e.detail && e.detail.search) {
        search = e.detail.search;
      }
      try {
        const usersList = await this.client.service('users').find({
          query: {
            $skip: skip,
            isListingEnabled,
            $or: [
              {
                name: {
                  $like: `${search}%`,
                },
              },
              {
                licenceNumber: {
                  $like: `${search}%`,
                },
              },
            ],
          },
        });
        // eslint-disable-next-line no-console
        // console.log(usersList.data);
        if (usersList.data.length > 0) {
          this._usersres = { ...usersList };
          this._users = [...usersList.data];
        }
        this._spinnerHidden = true;
      } catch (_err) {
        this._spinnerHidden = true;
        this._modalMsg = 'Erro ao buscar lista de usuários';
        this._toggleModal = true;
      }
    }
  }

  // patients

  _loadShowPatientForm() {
    if (typeof customElements.get('patient-form') === 'undefined') {
      import('./patient-form.js').then(() => {
        this._showPatientForm = true;
      });
    } else {
      this._showPatientForm = true;
    }
  }

  async _searchPatient(e) {
    if (this._user.isLoginEnabled) {
      // clear patient list
      this._patients = [];
      // eslint-disable-next-line no-console
      // console.log(`searching for patient: ${JSON.stringify(e.detail,null,2)}`);
      this._spinnerHidden = false;
      let skip = 0;
      if (e.detail && e.detail.skip) {
        skip = e.detail.skip;
      }
      let search = '';
      if (e.detail && e.detail.search) {
        search = e.detail.search;
      }
      try {
        const patientsList = await this.client.service('patients').find({
          query: {
            $skip: skip,
            $sort: {
              name: 1,
            },
            $or: [
              {
                name: {
                  $like: `${search}%`,
                },
              },
              {
                recNumber: {
                  $like: `${search}%`,
                },
              },
            ],
          },
        });
        // eslint-disable-next-line no-console
        // console.log(patientsList.data);
        if (patientsList.data.length > 0) {
          this._patientsRes = { ...patientsList };
          this._patients = [...patientsList.data];
        }
        this._spinnerHidden = true;
      } catch (_err) {
        this._spinnerHidden = true;
        this._modalMsg = 'Erro ao buscar lista de pacientes';
        this._toggleModal = true;
      }
    }
  }

  async _updatePatientsList(e) {
    if (this._user.isLoginEnabled) {
      // clear patients list
      this._patients = [];
      // eslint-disable-next-line no-console
      // console.log('updating patients list ...');
      this._spinnerHidden = false;
      let skip = 0;
      if (e.detail && e.detail.skip) {
        skip = e.detail.skip;
      }
      try {
        const patientsList = await this.client.service('patients').find({
          query: {
            $skip: skip,
            $sort: {
              name: 1,
            },
          },
        });
        // eslint-disable-next-line no-console
        // console.log(JSON.stringify(patientsList,null,2));
        if (patientsList.data.length > 0) {
          this._patientsRes = { ...patientsList };
          this._patients = [...patientsList.data];
        }
        this._spinnerHidden = true;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(err.message));
        this._spinnerHidden = true;
        this._modalMsg = 'Erro ao buscar lista de pacientes';
        this._toggleModal = true;
      }
    }
  }

  _editPatient(e) {
    // eslint-disable-next-line no-console
    // console.log(JSON.stringify(e.detail, null, 2));
    this._currentEditPatient = { ...e.detail };
    // eslint-disable-next-line no-console
    // console.log(this._currentEditPatient);
    this._loadShowPatientForm();
  }

  _removePatient(e) {
    // eslint-disable-next-line no-console
    // console.log(`entering removePatient for ${e.detail}`);

    this._confirmModalObject = { ...e.detail };
    this._confirmModalFunction = this._removeCurrentPatient;
    this._confirmationModalMsg = `Confirma a remoção do paciente: ${e.detail.nome}?`;
    this._toggleConfirmationModal = true;
  }

  async _removeCurrentPatient(p) {
    if (this._user.isLoginEnabled) {
      // eslint-disable-next-line no-console
      // console.log(JSON.stringify(p.detail, null, 2));
      this.dispatchEvent(new CustomEvent('show-spinner'));
      if (p.id) {
        // it is an update
        try {
          // eslint-disable-next-line no-console
          console.log('removing patient');
          await this.client.service('patients').remove(p.id);
          this._spinnerHidden = true;
          this._modalMsg = 'Paciente removido com sucesso!';
          this._toggleModal = true;
          // eslint-disable-next-line no-console
          // console.log(`Patient removed: ${JSON.stringify(res, null, 2)}`);
          this.dispatchEvent(
            new CustomEvent('update-patients-list', {
              bubbles: true,
              composed: true,
            })
          );
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(`could not remove patient: ${err}`);
        }
      } else {
        this._spinnerHidden = true;
        this._modalMsg = 'Erro ao remover paciente';
        this._toggleModal = true;
        this.dispatchEvent(
          new CustomEvent('update-patients-list', {
            bubbles: true,
            composed: true,
          })
        );
        // eslint-disable-next-line no-console
        console.log(`could not remove paciente: missing id`);
      }
    }
  }

  async _savePatient(e) {
    if (this._user.isLoginEnabled) {
      // eslint-disable-next-line no-console
      // console.log(JSON.stringify(e.detail, null, 2));
      this._spinnerHidden = false;
      const p = { ...e.detail };
      if (p.id) {
        try {
          // eslint-disable-next-line no-console
          console.log('updating patient');
          await this.client.service('patients').patch(p.id, { ...p });
          this._spinnerHidden = true;
          this._modalMsg = 'Paciente gravado com sucesso!';
          this._toggleModal = true;
          // eslint-disable-next-line no-console
          // console.log(`Patient updated: ${JSON.stringify(res, null, 2)}`);
          this.dispatchEvent(
            new CustomEvent('update-patients-list', {
              bubbles: true,
              composed: true,
            })
          );
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(`could not update patient: ${err}`);
        }
      } else {
        try {
          // eslint-disable-next-line no-console
          console.log('creating patient');
          await this.client.service('patients').create({ ...p });
          this._spinnerHidden = true;
          this._modalMsg = 'Paciente gravado com sucesso!';
          this._toggleModal = true;
          // eslint-disable-next-line no-console
          // console.log(JSON.stringify(res, null, 2));
          this.dispatchEvent(
            new CustomEvent('update-patients-list', {
              bubbles: true,
              composed: true,
            })
          );
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(`could not create patient: ${err}`);
        }
      }
    }
  }

  // Procedures Types
  _loadShowProcTypeForm() {
    // dynamically load procedure-type-form if neccessary
    if (typeof customElements.get('proctype-form') === 'undefined') {
      import('./proctype-form.js').then(() => {
        this._showProcTypeForm = true;
      });
    } else {
      this._showProcTypeForm = true;
    }
  }

  async _searchProcType(e) {
    if (this._user.isLoginEnabled) {
      // clear procedures types list
      this._proceduresTypes = [];
      // eslint-disable-next-line no-console
      // console.log(`searching for procedures types: ${e.detail}`);
      this._spinnerHidden = false;
      let skip = 0;
      if (e.detail && e.detail.skip) {
        skip = e.detail.skip;
      }
      let search = '';
      if (e.detail && e.detail.search) {
        search = e.detail.search;
      }
      try {
        const procTypesList = await this.client.service('proctypes').find({
          query: {
            $skip: skip,
            $or: [
              {
                descr: {
                  $like: `%${search}%`,
                },
              },
              {
                code: {
                  $like: `%${search}%`,
                },
              },
            ],
          },
        });
        // eslint-disable-next-line no-console
        // console.log(procTypesList.data);
        if (procTypesList.data.length > 0) {
          this._procTypesRes = { ...procTypesList };
          this._proceduresTypes = [...procTypesList.data];
        }
        this._spinnerHidden = true;
      } catch (_err) {
        this._spinnerHidden = true;
        this._modalMsg = 'Erro ao buscar lista de tipos de procedimentos';
        this._toggleModal = true;
      }
    }
  }

  async _updateProcTypesList(e) {
    if (this._user.isLoginEnabled) {
      // clear users list
      // this._proceduresTypes = [];
      // eslint-disable-next-line no-console
      // console.log('updating procedures types list ...');
      this._spinnerHidden = false;
      let skip = 0;
      if (e.detail && e.detail.skip) {
        skip = e.detail.skip;
      }
      try {
        const procTypesList = await this.client.service('proctypes').find({
          query: {
            $skip: skip,
            $sort: {
              code: 1,
            },
          },
        });
        // eslint-disable-next-line no-console
        // console.log(procTypesList);
        this._procTypesRes = { ...procTypesList };
        // eslint-disable-next-line no-console
        // console.log(this._procTypesRes);
        // if (procTypesList.data.length > 0) {
        // this._proceduresTypes = [...procTypesList.data];
        // }
        this._spinnerHidden = true;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(err.message));
        this._spinnerHidden = true;
        this._modalMsg = 'Erro ao buscar lista de tipos de procedimentos';
        this._toggleModal = true;
      }
    }
  }

  _editProcType(e) {
    // eslint-disable-next-line no-console
    // console.log(JSON.stringify(e.detail, null, 2));
    this._currentEditProcType = { ...e.detail };
    // eslint-disable-next-line no-console
    // console.log(this._currentEditProcType);
    this._loadShowProcTypeForm();
  }

  _removeProcType(e) {
    // eslint-disable-next-line no-console
    console.log(`entering removeProcType for ${e.detail}`);

    this._confirmModalObject = { ...e.detail };
    this._confirmModalFunction = this._removeCurrentProctype;
    this._confirmationModalMsg = `Confirma a remoção do tipo de procedimento: ${e.detail.descr}`;
    this._toggleConfirmationModal = true;
  }

  async _removeCurrentProctype(p) {
    if (this._isAdmin && this._user.isLoginEnabled) {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(p.detail, null, 2));
      this.dispatchEvent(new CustomEvent('show-spinner'));
      if (p.id) {
        // it is an update
        try {
          // eslint-disable-next-line no-console
          console.log('removing procedure type');
          const res = await this.client.service('proctypes').remove(p.id);
          this._spinnerHidden = true;
          this._modalMsg = 'Tipo de procedimento removido com sucesso!';
          this._toggleModal = true;
          // eslint-disable-next-line no-console
          console.log(
            `Procedure type removed: ${JSON.stringify(res, null, 2)}`
          );
          this.dispatchEvent(
            new CustomEvent('update-procedures-types-list', {
              bubbles: true,
              composed: true,
            })
          );
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(`could not remove procedure type: ${err}`);
        }
      } else {
        this._spinnerHidden = true;
        this._modalMsg = 'Erro ao remover o tipo de procedimento';
        this._toggleModal = true;
        this.dispatchEvent(
          new CustomEvent('update-procedures-types-list', {
            bubbles: true,
            composed: true,
          })
        );
        // eslint-disable-next-line no-console
        console.log(`could not remove procedure type: missing id`);
      }
    }
  }

  async _saveProcType(e) {
    if (this._isAdmin && this._user.isLoginEnabled) {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(e.detail, null, 2));
      this.dispatchEvent(new CustomEvent('show-spinner'));
      const p = { ...e.detail };
      if (p.id) {
        // it is an update
        try {
          // eslint-disable-next-line no-console
          console.log('updating procedure type');
          const res = await this.client
            .service('proctypes')
            .patch(p.id, { ...p });
          this._spinnerHidden = true;
          this._modalMsg = 'Tipo de procedimento gravado com sucesso!';
          this._toggleModal = true;
          // eslint-disable-next-line no-console
          console.log(
            `Procedure type updated: ${JSON.stringify(res, null, 2)}`
          );
          this.dispatchEvent(
            new CustomEvent('update-procedures-types-list', {
              bubbles: true,
              composed: true,
            })
          );
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(`could not update procedure type: ${err}`);
        }
      } else {
        // it is a new procedure type
        try {
          // eslint-disable-next-line no-console
          console.log('creating procedure type');
          const res = await this.client.service('proctypes').create({ ...p });
          this._spinnerHidden = true;
          this._modalMsg = 'Tipo de procedimento gravado com sucesso!';
          this._toggleModal = true;
          // eslint-disable-next-line no-console
          console.log(JSON.stringify(res, null, 2));
          this.dispatchEvent(
            new CustomEvent('update-procedures-types-list', {
              bubbles: true,
              composed: true,
            })
          );
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(`could not create procedure type: ${err}`);
        }
      }
    }
  }

  _confirmModalAction() {
    this._confirmModalFunction(this._confirmModalObject);
  }

  render() {
    return html`
      <nav
        id="navbar"
        class="navbar is-primary is-fixed-top"
        role="navigation"
        aria-label="main navigation"
      >
        <div class="navbar-brand">
          <a
            class="navbar-item has-text-black"
            href="#"
            style="font-weight:bold; font-size:22px;"
          >
            Collect-CC
          </a>

          <a
            role="button"
            class="navbar-burger burger ${classMap({
              'is-active': this._burgerActive,
            })}"
            id="navbarburger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicMenu"
            @click="${this._navBarBurgerClicked}"
            @keydown="${this._navBarBurgerClicked}"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div
          id="navbarBasicMenu"
          class="navbar-menu ${classMap({ 'is-active': this._burgerActive })}"
        >
          <div
            class="navbar-start ${classMap({ 'is-hidden': !this._loggedIn })}"
          >
            <a
              class="navbar-item"
              href="/procsview"
              @click="${() => {
                this._burgerActive = false;
              }}"
            >
              Pesquisar
            </a>

            <a
              class="navbar-item"
              href="/procform"
              @click="${() => {
                this._burgerActive = false;
              }}"
            >
              Adicionar
            </a>

            <div
              id="adminmenu"
              class="navbar-item has-dropdown ${classMap({
                'is-hidden': !this._isAdmin,
                'is-active': this._adminDropDownOpen,
              })}"
            >
              <a
                class="navbar-link"
                @click="${() => {
                  this._adminDropDownOpen = !this._adminDropDownOpen;
                }}"
                @keydown="${() => {
                  this._adminDropDownOpen = !this._adminDropDownOpen;
                }}"
              >
                Admin
              </a>

              <div class="navbar-dropdown is-boxed">
                <a
                  class="navbar-item"
                  href="/ptsview"
                  @click="${() => {
                    this._adminDropDownOpen = false;
                    this._burgerActive = false;
                  }}"
                >
                  Pacientes
                </a>
                <a
                  class="navbar-item"
                  href="/usersview"
                  @click="${() => {
                    this._adminDropDownOpen = false;
                    this._burgerActive = false;
                  }}"
                >
                  Usuários
                </a>
                <a
                  class="navbar-item"
                  href="/procedurestypesview"
                  @click=${() => {
                    this._adminDropDownOpen = false;
                    this._burgerActive = false;
                  }}
                >
                  Tipos de Procedimentos
                </a>
              </div>
            </div>
          </div>

          <div class="navbar-end">
            <div
              class="navbar-item 
              ${classMap({ 'is-hidden': !this._loggedIn })}
              "
            >
              <span class="mr-2">
                <icon-user></icon-user>
              </span>
              <span>
                ${this._user && this._user.name ? this._user.name : ''}
              </span>
            </div>

            <div class="navbar-item">
              <div class="buttons">
                <a
                  id="logoutbtn"
                  href="/home"
                  class="button is-light ${classMap({
                    'is-hidden': !this._loggedIn,
                  })}"
                  @click="${this._logoutClicked}"
                >
                  Logout
                </a>
                <a
                  id="loginbtn"
                  href="/loginform"
                  class="button is-light ${classMap({
                    'is-hidden': this._loggedIn,
                  })}"
                  @click=${() => {
                    this._burgerActive = false;
                  }}
                >
                  Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main id="maincontent">
        <section
          id="home"
          class="section container has-text-centered ${classMap({
            'is-hidden': this._page !== '/',
          })}"
        >
          <div>
            <br />
            <br />
            <br />
            <br />
            <h1 class="title">Registro de Produção do Centro Cirúrgico</h1>
          </div>
        </section>

        <login-form
          id="loginform"
          class="${classMap({
            'is-hidden': this._page !== 'loginform',
          })}"
        ></login-form>
        <proc-form
          class="${classMap({
            'is-hidden': this._page !== 'procform' && this._page !== 'procedit',
          })}"
          .user="${this._user}"
          .users="${this._users}"
          .patients="${this._patients}"
          .proctypes="${this._proceduresTypes}"
          ?editmode="${this._editProcedureMode}"
          .procedure="${this._currentProcedure}"
        ></proc-form>
        <procs-view
          id="procsview"
          class="${classMap({
            'is-hidden': this._page !== 'procsview',
          })}"
          .users="${this._users}"
          .user="${this._user}"
          .procsres="${this._procsres}"
          .timestamp="${this._timestamp}"
        ></procs-view>
        <patients-view
          id="ptsview"
          class="${classMap({
            'is-hidden': this._page !== 'ptsview',
          })}"
          .patientsres="${this._patientsRes}"
        >
        </patients-view>
        <users-view
          id="usersview"
          .usersres="${this._usersres}"
          class="${classMap({
            'is-hidden': this._page !== 'usersview' || !this._isAdmin,
          })}"
        ></users-view>
        <proctypes-view
          id="procedurestypesview"
          .proctypesres="${this._procTypesRes}"
          class="${classMap({
            'is-hidden': this._page !== 'procedurestypesview' || !this._isAdmin,
          })}"
        ></proctypes-view>
      </main>
      <footer
        class="navbar is-fixed-bottom has-background-light
              has-text-centered is-vcentered"
      >
        <div class="column"><small>2022</small></div>
      </footer>

      <!-- dynamic elements -->
      <user-form
        class="${classMap({ 'is-hidden': !this._showUserForm })}"
        ?activate="${this._showUserForm}"
        .user="${this._currentEditUser}"
      ></user-form>
      <patient-form
        class="${classMap({ 'is-hidden': !this._showPatientForm })}"
        ?activate="${this._showPatientForm}"
        .patient="${this._currentEditPatient}"
      ></patient-form>
      <uprofile-form
        class="${classMap({ 'is-hidden': !this._showUserProfileForm })}"
        ?activate="${this._showUserProfileForm}"
        .user="${this._currentEditUser}"
      ></uprofile-form>
      <proctype-form
        class="${classMap({ 'is-hidden': !this._showProcTypeForm })}"
        ?activate="${this._showProcTypeForm}"
        .proceduretype="${this._currentEditProcType}"
      ></proctype-form>
      <spinner-loader
        class="${classMap({ 'is-hidden': this._spinnerHidden })}"
      ></spinner-loader>
      <!-- dynamic modal dialog -->
      <div
        id="modalmsg"
        class="modal ${classMap({ 'is-active': this._toggleModal })}"
      >
        <div
          class="modal-background"
          @click="${() => {
            this._toggleModal = false;
          }}"
          @keydown="${() => {
            this._toggleModal = false;
          }}"
        ></div>
        <div class="modal-content">
          <div class="box container has-text-centered">${this._modalMsg}</div>
        </div>
        <button
          class="modal-close is-large"
          @click="${() => {
            this._toggleModal = false;
          }}"
          aria-label="close"
        ></button>
      </div>

      <div
        id="confirmationmodal"
        class="modal ${classMap({
          'is-active': this._toggleConfirmationModal,
        })}"
      >
        <div
          class="modal-background"
          @click="${() => {
            this._toggleConfirmationModal = false;
          }}"
          @keydown="${() => {
            this._toggleConfirmationModal = false;
          }}"
        ></div>
        <div class="modal-card">
          <section class="modal-card-body">
            ${this._confirmationModalMsg}
          </section>
          <footer class="modal-card-foot">
            <button
              class="button is-danger"
              @click="${() => {
                this._toggleConfirmationModal = false;
                this._confirmModalAction();
              }}"
            >
              Sim
            </button>
            <button
              class="button is-success"
              @click="${() => {
                this._toggleConfirmationModal = false;
              }}"
            >
              Não
            </button>
          </footer>
        </div>
        <button
          class="modal-close is-large"
          @click="${() => {
            this._toggleModal = false;
          }}"
          aria-label="close"
        ></button>
      </div>
    `;
  }
}
