import { html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';

export class ProcTypeForm extends LitElement {
  // use lightDOM
  createRenderRoot() {
    return this;
  }

  static get properties() {
    return {
      proceduretype: { type: Object },
      activate: { type: Boolean },
      _descr: { type: String, state: true },
      _code: { type: String, state: true },
      _requireSurgReport: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();
    this.proceduretype = {};
    this.activate = false;
    this._descr = '';
    this._code = '';
    this._requireSurgReport = false;
  }

  updated(changedProperties) {
    if (changedProperties.has('proceduretype')) {
      if (this.proceduretype) {
        this._descr = this.proceduretype.descr ? this.proceduretype.descr : '';
        this._code = this.proceduretype.code ? this.proceduretype.code : '';
        this._requireSurgReport = ( this.proceduretype.requireSurgReport && true );
      }
    }
  }

  _closeForm() {
    // clear form
    this._clearFields();
    // fire event to hide procedure form from parent's view
    this.dispatchEvent(
      new CustomEvent('close-procedure-type-form', {
        bubbles: true,
        composed: true,
      })
    );
  }

  _clearFields() {
    this.proceduretype = {};
    // @ts-ignore
    document.getElementById('proctype-form').reset();
    this._descr = '';
    this._code = '';
    this._requireSurgReport = false;
  }

  _saveForm(e) {
    e.preventDefault();
    // @ts-ignore
    if (document.getElementById('proctype-form').reportValidity()) {
      this._handleSaveForm();
    }
  }

  _handleSaveForm() {
    const p = {
      descr: this._descr,
      code: this._code,
      requireSurgReport: this._requireSurgReport,
    };
    if (this.proceduretype && this.proceduretype.id) {
      p.id = this.proceduretype.id;
    }
    // eslint-disable-next-line no-console
    console.log(p);
    // fire event to save/update doctor
    this.dispatchEvent(
      new CustomEvent('save-procedure-type-form', {
        detail: p,
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
            <p class="modal-card-title">Procedimento</p>
            <button
              class="delete"
              aria-label="close"
              @click="${this._closeForm}"
            ></button>
          </header>
          <section class="modal-card-body">
            <form id="proctype-form">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label><b>Nome/Descr.</b></label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <input
                      class="input"
                      id="proctype"
                      type="text"
                      placeholder="nome/descr."
                      .value="${this._descr}"
                      required
                      @input="${e => {
                      this._descr = e.target.value;
                      }}"
                    />
                  </div>
                </div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label><b>Cód. SUS</b></label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <input
                      class="input"
                      id="code"
                      type="text"
                      placeholder="xx.xx.xx.xxx-x"
                      .value="${this._code}"
                      @input="${e => {
                      this._code = e.target.value;
                      }}"
                    />
                  </div>
                </div>
              </div>
              <div class="field">
                <label class="checkbox">
                  <input 
                    type="checkbox"
                    id="requireSurgReport"
                    ?checked="${this._requireSurgReport}"
                    @change="${ () => { 
                    this._requireSurgReport = !this._requireSurgReport; 
                    } 
                    }">
                    Necessita de ficha operatória
                  </label>
                </div>
              </form>
            </section>
                    <footer class="modal-card-foot">
                      <button class="button is-success" @click="${this._saveForm}">
                        Gravar
                      </button>
                      <button class="button" @click="${this._closeForm}">
                        Cancelar
                      </button>
                    </footer>
          </div>
        </div>
                    `;
                    }
                    }
