import { DateTime } from 'luxon';

export default function sheets(procedures, user) {
  const wb = window.XLSX.utils.book_new();
  wb.Props = {
    Title: 'Relatório de Produção do Centro Cirúrgico',
    Subject: 'Produção HGRS',
    Author: `${user.name}`,
    CreatedDate: DateTime.local().toISO(),
  };
  wb.SheetNames.push('Sheet1');
  const header = [
    'Data',
    'Paciente',
    'Registro',
    'Idade',
    'Sexo',
    'Cidade',
    'Estado',
    'Setor de Origem',
    'Leito',
    'Sala',
    'Data pct em sala',
    'Hora pct em sala',
    'Data pct saiu da sala',
    'Hora pct saiu da sala',
    'Data cirurgião em sala',
    'Hora cirurgião em sala',
    'Data anestesista em sala',
    'Hora anestesista em sala',
    'Data liberação para início',
    'Hora liberação para início',
    'Equipe',
    'Cirurgião1',
    'Cirurgião2',
    'Cirurgião3',
    'Cirurgião4',
    'Cirurgião5',
    'Cirurgião6',
    'Circulante',
    'Procedimento',
    'Código',
    'Porte',
    'Tipo',
    'Foi suspensa?',
    'Motivo da suspensão',
    'Data do Início da Cirurgia',
    'Hora do Início da Cirurgia',
    'Data do Fim da Cirurgia',
    'Hora do Fim da Cirurgia',
    'Tempo de Cirurgia (min)',
    'Anestesista1',
    'Anestesista2',
    'Anestesista3',
    'Tipo de Anestesia',
    'Subtipo de Anestesia',
    'Classificação ASA',
    'Início da Anestesia',
    'Fim da Anestesia',
    'Tempo de Anestesia (min)',
    'Setor de Destino',
    'Leito de Destino',
    'Potencial de Contaminação',
    'Usou Antibiótico',
    'Óbito em sala',
    'Observação',
    'Criado por',
    'Criado em',
    'Atualizado por',
    'Atualizado em',
  ];
  const rows = procedures.map(p => [
    DateTime.fromSQL(p.procStartDateTime).toFormat('dd/LL/yyyy'),
    p.ptName,
    p.ptRecN,
    p.ptAge,
    p.ptGender,
    p.ptCity,
    p.ptState,
    p.ptWard,
    p.ptBed,
    p.surgicalRoom,
    DateTime.fromSQL(p.ptAtSiteDateTime).toFormat('dd/LL/yyyy'),
    DateTime.fromSQL(p.ptAtSiteDateTime).toFormat('HH:mm'),
    DateTime.fromSQL(p.ptLeftSiteDateTime).toFormat('dd/LL/yyyy'),
    DateTime.fromSQL(p.ptLeftSiteDateTime).toFormat('HH:mm'),
    DateTime.fromSQL(p.surgeonAtSiteDateTime).toFormat('dd/LL/yyyy'),
    DateTime.fromSQL(p.surgeonAtSiteDateTime).toFormat('HH:mm'),
    DateTime.fromSQL(p.anestAtSiteDateTime).toFormat('dd/LL/yyyy'),
    DateTime.fromSQL(p.anestAtSiteDateTime).toFormat('HH:mm'),
    DateTime.fromSQL(p.startOfProcAuthByAnestDateTime).toFormat('dd/LL/yyyy'),
    DateTime.fromSQL(p.startOfProcAuthByAnestDateTime).toFormat('HH:mm'),
    p.team,
    p.user1Name,
    p.user2Name,
    p.user3Name,
    p.user4Name,
    p.user5Name,
    p.user6Name,
    p.circulatingNurse,
    p.descr,
    p.code,
    p.surgicalComplexity,
    p.typeOfSurgery,
    p.wasCanceled === 1 ? 'SIM' : 'NÃO',
    p.cancelationReason,
    DateTime.fromSQL(p.procStartDateTime).toFormat('dd/LL/yyyy'),
    DateTime.fromSQL(p.procStartDateTime).toFormat('HH:mm'),
    DateTime.fromSQL(p.procEndDateTime).toFormat('dd/LL/yyyy'),
    DateTime.fromSQL(p.procEndDateTime).toFormat('HH:mm'),
    p.procDuration,
    p.anesthesiologist1Name,
    p.anesthesiologist2Name,
    p.anesthesiologist3Name,
    p.anesthesiaType,
    p.anesthesiaSubType,
    p.riskClassASA,
    DateTime.fromSQL(p.anestStartDateTime).toFormat('HH:mm'),
    DateTime.fromSQL(p.anestEndDateTime).toFormat('HH:mm'),
    p.anestDuration,
    p.ptDestWard,
    p.ptDestBed,
    p.contaminationRisk,
    p.antibioticUse === 1 ? 'SIM' : 'NÃO',
    p.ptDeadOnOpRoom === 1 ? 'SIM' : 'NÃO',
    p.notes,
    p.createdByUserName,
    DateTime.fromSQL(p.createdAt).toFormat('dd/LL/yyyy HH:mm'),
    p.updatedByUserName,
    DateTime.fromSQL(p.updatedAt).toFormat('dd/LL/yyyy HH:mm'),
  ]);
  const wsData = [header, ...rows];
  // console.log(JSON.stringify(wsData,null,2));
  const ws = window.XLSX.utils.aoa_to_sheet(wsData);
  wb.Sheets.Sheet1 = ws;
  const userName = user.name.replace(/\s/g, '');
  const dateTime = DateTime.local().toFormat('yyyyLLddHHmmss');
  const fileName = `RelatorioProducaoCC_${userName}_${dateTime}.xlsx`;
  window.XLSX.writeFile(wb, fileName);
}
