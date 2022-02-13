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
    'Setor',
    'Leito',
    'Cidade',
    'Estado',
    'Paciente',
    'Registro',
    'Idade',
    'Sexo',
    'Sala',
    'Equipe',
    'Usuário1',
    'Usuário2',
    'Usuário3',
    'Usuário4',
    'Usuário5',
    'Usuário6',
    'Circulante',
    'Procedimento',
    'Código',
    'Porte',
    'Tipo',
    'Início da Cirurgia',
    'Fim da Cirurgia',
    'Tempo de Cirurgia (min)',
    'Local do proc.',
  ];
  const rows = procedures.map(p => [
    DateTime.fromSQL(p.procStartDateTime).toFormat('dd/LL/yyyy'),
    p.ptWard,
    p.ptBed,
    p.ptCity,
    p.ptState,
    p.ptName,
    p.ptRecN,
    p.ptAge,
    p.ptGender,
    p.surgicalRoom,
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
    DateTime.fromSQL(p.procStartDateTime).toFormat('HH:mm'),
    DateTime.fromSQL(p.procEndDateTime).toFormat('HH:mm'),
    p.procDuration,
    p.execPlace,
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
