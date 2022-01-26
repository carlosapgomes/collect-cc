import { html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { DateTime } from 'luxon';

export class PatientForm extends LitElement {
  // use lightDOM
  createRenderRoot() {
    return this;
  }

  static get properties() {
    return {
      patient: { type: Object },
      activate: { type: Boolean, state: true },
      _name: { type: String, state: true },
      _gender: { type: String, state: true },
      _dateOfBirth: { type: Date, state: true },
      _recNumber: { type: String, state: true },
      _city: { type: String, state: true },
      _state: { type: String, state: true },
    };
  }

  constructor() {
    super();
    this.patient = {};
    this.activate = false;
    this._name = '';
    this._gender = 'D';
    this._dateOfBirth = DateTime.local().toISODate();
    this._recNumber = '';
    this._city = '';
    this._state = '';
  }

  updated(changedProperties) {
    if (changedProperties.has('patient')) {
      if (this.patient) {
        this._name = this.patient.name ? this.patient.name : '';
        this._gender = this.patient.gender ? this.patient.gender : '';
        this._recNumber = this.patient.recNumber ? this.patient.recNumber : '';
        this._dateOfBirth = this.patient.dateOfBirth
          ? DateTime.fromSQL(this.patient.dateOfBirth).toISODate()
          : DateTime.local().toISODate();
        this._city = this.patient.city ? this.patient.city : '';
        this._state = this.patient.state ? this.patient.state : '';
      }
    }
  }

  _closeForm() {
    // clear form
    this._clearFields();
    // fire event to hide procedure form from parent's view
    this.dispatchEvent(
      new CustomEvent('close-patient-form', { bubbles: true, composed: true })
    );
  }

  _clearFields() {
    this.patient = {};
    // @ts-ignore
    document.getElementById('patient-form').reset();
    this._name = '';
    this._gender = 'D';
    this._dateOfBirth = DateTime.local().toISODate();
    this._recNumber = '';
    this._city = '';
    this._state = '';
  }

  _saveForm(e) {
    e.preventDefault();
    // @ts-ignore
    if (document.getElementById('patient-form').reportValidity()) {
      this._handleSaveForm();
    }
  }

  _handleSaveForm() {
    // eslint-disable-next-line no-console
    // console.log(this._dateOfBirth);
    const p = {
      name: this._name,
      gender: this._gender,
      dateOfBirth: DateTime.fromISO(this._dateOfBirth).toISO(),
      recNumber: this._recNumber,
      city: this._city,
      state: this._state,
    };
    // eslint-disable-next-line no-console
    // console.log(`Saving patient: ${JSON.stringify(p, null, 2)}`);
    if (this.patient && this.patient.id) {
      p.id = this.patient.id;
    }

    // eslint-disable-next-line no-console
    // console.log(p);
    // fire event to save/update.patient
    this.dispatchEvent(
      new CustomEvent('save-patient-form', {
        detail: { ...p },
        bubbles: true,
        composed: true,
      })
    );
    // clear and close form
    this._closeForm();
  }

  render() {
    return html`
      <div class="modal ${classMap({ 'is-active': this.activate })}">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Paciente</p>
            <button
              class="delete"
              aria-label="close"
              @click="${this._closeForm}"
            ></button>
          </header>
          <section class="modal-card-body">
            <form autocomplete="off" id="patient-form">
              <div class="field">
                <label class="label">Nome:</label>
                <input
                  class="input"
                  id="name"
                  type="text"
                  placeholder="Nome"
                  .value="${this._name}"
                  @input="${e => {
                    this._name = e.target.value;
                  }}"
                  required
                />
              </div>
              <label class="label">Sexo:</label>
              <div class="control">
                <label class="radio">
                  <input
                    type="radio"
                    name="gender"
                    ?checked="${this._gender === 'M'}"
                    @input="${() => {
                      this._gender = 'M';
                    }}"
                  />
                  M
                </label>
                <label class="radio">
                  <input
                    type="radio"
                    name="gender"
                    ?checked="${this._gender === 'F'}"
                    @input="${() => {
                      this._gender = 'F';
                    }}"
                  />
                  F
                </label>
                <label class="radio">
                  <input
                    type="radio"
                    name="gender"
                    checked
                    ?checked="${this._gender === 'D'}"
                    @input="${() => {
                      this._gender = 'F';
                    }}"
                  />
                  Desconhecido
                </label>
                <label class="radio">
                  <input
                    type="radio"
                    name="gender"
                    ?checked="${this._gender === 'NA'}"
                    @input="${() => {
                      this._gender = 'F';
                    }}"
                  />
                  Não se aplica
                </label>
              </div>
              <div class="field">
                <label class="label">DN:</label>
                <input
                  class="input"
                  id="date-of-birth"
                  type="date"
                  .value="${this._dateOfBirth}"
                  @input="${e => {
                    this._dateOfBirth = e.target.value;
                  }}"
                  required
                />
              </div>
              <div class="field">
                <label class="label">Registro:</label>
                <input
                  class="input"
                  id="record-number"
                  type="text"
                  placeholder="Registro"
                  .value="${this._recNumber}"
                  @input="${e => {
                    this._recNumber = e.target.value;
                  }}"
                  required
                />
              </div>
              <div class="field">
                <label class="label">Cidade:</label>
                <input
                  class="input"
                  id="city"
                  list="cities"
                  type="text"
                  placeholder="Cidade"
                  .value="${this._city}"
                  @input="${e => {
                    this._city = e.target.value;
                  }}"
                />
                <datalist id="cities">
                  <option value="Salvador"></option>
                  <option value="Lauro de Freitas"></option>
                  <option value="Camaçari"></option>
                  <option value="Simões Filho"></option>
                  <option value="Feira de Santana"></option>
                </datalist>
              </div>
              <div class="field">
                <label class="label">Estado:</label>
                <input
                  class="input"
                  id="state"
                  list="states"
                  type="text"
                  placeholder="Estado"
                  .value="${this._state}"
                  @input="${e => {
                    this._state = e.target.value;
                  }}"
                />
                <datalist id="states">
                  <option value="AC"></option>
                  <option value="AL"></option>
                  <option value="AP"></option>
                  <option value="AM"></option>
                  <option value="BA"></option>
                  <option value="CE"></option>
                  <option value="DF"></option>
                  <option value="ES"></option>
                  <option value="GO"></option>
                  <option value="MA"></option>
                  <option value="MT"></option>
                  <option value="MS"></option>
                  <option value="MG"></option>
                  <option value="PA"></option>
                  <option value="PB"></option>
                  <option value="PR"></option>
                  <option value="PE"></option>
                  <option value="PI"></option>
                  <option value="RJ"></option>
                  <option value="RN"></option>
                  <option value="RS"></option>
                  <option value="RO"></option>
                  <option value="RR"></option>
                  <option value="SC"></option>
                  <option value="SP"></option>
                  <option value="SE"></option>
                  <option value="TO"></option>
                </datalist>
              </div>
            </form>
          </section>
          <footer class="modal-card-foot">
            <button class="button is-success" @click="${this._saveForm}">
              Gravar
            </button>
            <button class="button" @click="${this._closeForm}">Cancelar</button>
          </footer>
        </div>
      </div>
    `;
  }
}
