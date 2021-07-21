import { html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import './btn-fab.js';
import { DateTime } from 'luxon';
import './icons/icon-download.js';
import './icons/icon-reload.js';

export class ProcsView extends LitElement {
  // use lightDOM
  createRenderRoot() {
    return this;
  }

  static get properties() {
    return {
      procedures: { type: Array },
      user: { type: Object },
      date: { type: String },
      _searchByDate : { type: String, state: true },
      _searchByPersonTeam: { type: String, state: true },
      _userName: { type: String, state: true },
      _team: { type: String, state: true },
      _currentSearchUserID: { type: String, state: true },
      _currentSearchTeam: { type: String, state: true },
      _toggleUserOrTeamSearch: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();
    this.procedures = [];
    this.date = '';
    this._searchByDate =  'day';
    this._searchByPersonTeam =  'person';
    this._userName = '';
    this._team = '';
    this._toggleUserOrTeamSearch = true;
    this._currentSearchTeam = 'all';
    this._currentSearchUserID = '';
  }

  firstUpdated() {
    this.dispatchEvent(
      new CustomEvent('update-procedures-list', {
        bubbles: true,
        composed: true,
      })
    );
  }

  _edit(p) {
    this.dispatchEvent(
      new CustomEvent('edit-procedure', {
        detail: { ...p },
        bubbles: true,
        composed: true,
      })
    );
  }

  _addProc() {
    this.dispatchEvent(
      new CustomEvent('add-procedure', { bubbles: true, composed: true })
    );
  }

  _updateProcedures() {
      this.dispatchEvent(
        new CustomEvent('update-procedures-list', {
          detail: { 
            searchByDate: this._searchByDate,
            searchByPersonTeam: this._searchByPersonTeam,
            date: this.date.toISO(),
            searchID: this._currentSearchUserID,
            searchTeam: this._currentSearchTeam,
          },
          bubbles: true,
          composed: true,
        })
      );
  }

  _searchUser(e) {
    // eslint-disable-next-line no-console
    console.log(e.target.value);
    // fire event to hide procedure form from parent's view

    if (e.target.value.length > 2) {
      this.dispatchEvent(
        new CustomEvent('search-user', {
          detail: e.target.value,
          bubbles: true,
          composed: true,
        })
      );
      this._activateUserSearchDropDown = true;
    }
  }

  _getSpreadsheet(){
    this.dispatchEvent(
      new CustomEvent('get-spreadsheet',{
        bubbles: true,
        composed:true, 
      })
    );
  }

  render() {
    return html`
      <style>
        .proc-card {
          margin-bottom: 0.3em;
        }
          svg {
            margin: 0.4em;
            overflow: visible;
        }
      </style>
        <section id="procedures" class="section">
          <div class="column is-6 is-offset-3">
            <div class="container">
              <h1 class="subtitle has-text-centered is-3">Procedimentos</h1>
                  <div class="field is-horizontal">
                    <div class="field-body">    
                      <div class="field">
                        <div class="control">
                          <label><b>Período:</b> </label>
                          <label class="radio">
                            <input 
                              type="radio" 
                              checked
                              name="searchByDate"
                              @click="${() => {this._searchByDate = 'day';}}"/>
                            Dia
                          </label>
                          <label class="radio">
                            <input 
                              type="radio" 
                              name="searchByDate"
                              @click="${() => {this._searchByDate = 'week';}}"/>
                            Semana
                          </label>
                          <label class="radio">
                            <input 
                              type="radio" 
                              name="searchByDate"
                              @click="${() => {this._searchByDate = 'month';}}"/>
                            Mês
                          </label>
                        </div>
                      </div>
                    </div>
              </div>
              <div class="is-flex 
                flex-direction-row
                is-justify-content-space-between">
                <input
                  id="procs-date"
                  class="input"
                  type="date"
                  .value="${this.date.toISODate()}"
                  @input="${(e)=>{
                  this.date = DateTime.fromISO(e.target.value);
                  }}"
                />
              </div>            
              <br/>
                <div class="field is-horizontal">
                  <div class="field-body">    
                    <div class="field">
                      <div  class="control">
                        <label><b>Executante:</b></label>
                        <label class="radio">
                          <input 
                            type="radio" 
                            checked
                            name="searchByPersonTeam"
                            @click="${() => {
                            this._searchByPersonTeam = 'person';
                            this._toggleUserOrTeamSearch = true;}}"/>
                          Indivíduo 
                        </label>
                        <label class="radio">
                          <input 
                            type="radio" 
                            name="searchByPersonTeam"
                            @click="${() => {
                            this._searchByPersonTeam = 'team';
                            this._toggleUserOrTeamSearch = false;}}"/>
                          Equipe 
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="is-flex 
                  flex-direction-row is-justify-content-space-between">
                  <div class="is-flex-grow-2">
                    <!-- users dropdown search -->
                    <div
                      class="dropdown is-up is-expanded ${classMap({
                      'is-hidden': !this._toggleUserOrTeamSearch,
                      'is-active': this._activateUserSearchDropDown,
                      })}"
                    >
                      <div class="dropdown-trigger">
                        <div class="field">
                          <div class="control is-expanded has-icons-right">
                            <input
                              class="input"
                              type="search"
                              @keyup="${this._searchUser}"
                              .value="${this._userName}"
                              placeholder="nome/registro de classe"
                            />
                            <icon-search></icon-search>
                          </div>
                        </div>
                      </div>
                      <div class="dropdown-menu" id="dropdown-menu" role="menu">
                        <div class="dropdown-content">
                          ${this.users
                            ? this.users.map(
                              u => html`
                                <a
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
                                >${u.name} - ${u.licenceNumber}</a
                        >
                              `
                            )
                            : html`<p></p>`}
                        </div>
                      </div>
                    </div>    
                    <div class="${classMap({
                      'is-hidden': this._toggleUserOrTeamSearch,
                      })}">
                      <div class="select">
                        <select
                          id="team"
                          name="team"
                          .value="${this._team}"
                          @blur="${e => {
                          this._team = e.target.value;
                          }}"
                        >
                          <option value="all">Todas</option>
                          <option value="Cirurgia Geral">Cirurgia Geral</option>
                          <option value="Cirurgia Plástica">Cirurgia Plástica</option>
                          <option value="Cirurgia Pediátrica">Cirurgia Pediátrica</option>
                          <option value="Cirurgia Vascular">Cirurgia Vascular</option>
                          <option value="Ginecologia Obstetrícia">Ginecologia Obstetrícia</option>
                          <option value="Neurocirurgia">Neurocirurgia</option>
                          <option value="Proctologia">Proctologia</option>
                          <option value="Radiointervensão">Radiointervensão</option>
                          <option value="Urologia">Urologia</option>
                        </select>
                      </div></div>
                  </div>
                  <button class="button is-light is-flex-grow-1"
                    @click="${this._updateProcedures}">
                    <icon-reload class="has-tooltip-arrow has-tooltip-top"
                      data-tooltip="Recarregar"></icon-reload>
                  </button>
                  <button class="button is-success is-flex-grow-1"
                    @click="${this._getSpreadsheet}">
                    <icon-download
                      class="has-tooltip-arrow has-tooltip-top"
                      data-tooltip="Baixar"></icon-download>
                  </button>
                </div> 
              <br />
              ${this.procedures
                ? this.procedures.map(
                  p => html`
                    <div class="card proc-card">
                      <div class="card-content">
                        <div class="content is-flex is-flex-direction-row">
                          <div class="is-align-self-flex-start is-flex-grow-4">
                            <strong>${p.descr}</strong>
                            <small>
                              Data:
                              ${DateTime.fromSQL(p.procDateTime, {
                                locale: 'pt-BR',
                              }).toLocaleString(DateTime.DATETIME_SHORT)}<br />
                              Paciente: ${p.ptName}<br />
                              Médico: ${p.docName}
                            </small>
                          </div>
                          <div
                            class="is-flex 
                            is-align-self-flex-end
                            is-flex-grow-1
                            is-flex-direction-column"
                          >
                            <div
                              class="button is-white
                              is-align-self-flex-end
                              has-tooltip-arrow
                              has-tooltip-right"
                              data-tooltip="Editar"
                              @click="${() => {
                              this._edit(p);
                              }}"
                              @keydown="${() => {
                              this._edit(p);
                              }}"
                            >
                              <span class="icon is-small is-right">
                                <svg
                                  id="i-edit"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 32 32"
                                  width="16"
                                  height="16"
                                  fill="none"
                                  stroke="currentcolor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                >
                                  <path
                                    d="M30 7 L25 2 5 22 3 29 10 27 Z M21 6 L26 11 Z M5 22 L10 27 Z"
                                  />
                                </svg>
                              </span>
                            </div>
                            <div
                              class="button is-white
                              is-align-self-flex-end
                              has-tooltip-arrow
                              has-tooltip-right"
                              data-tooltip="Remover"
                              @click="${() => {
                              this._remove(p);
                              }}"
                              @keydown="${() => {
                              this._remove(p);
                              }}"
                            >
                              <span class="icon is small is-right">
                                <svg
                                  id="i-trash"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 32 32"
                                  width="16"
                                  height="16"
                                  fill="none"
                                  stroke="currentcolor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                >
                                  <path
                                    d="M28 6 L6 6 8 30 24 30 26 6 4 6 M16 12 L16 24 M21 12 L20 24 M11 12 L12 24 M12 6 L13 2 19 2 20 6"
                                  />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  `
                )
                : html`</p>`}
            </div>
          </div>

          <btn-fab
            @click="${() => {
            this._addProc();
            }}"
          ></btn-fab>
        </section>
    `;
  }
}
