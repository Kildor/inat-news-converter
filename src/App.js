import React from 'react';
import './App.scss';
import Converter from './Converter.jsx';

function App() {

  const users = `1	dmitrydubikovskiy	545	174
2	aquacielo	174	75
3	gonkem1986	127	86
4	angelina4220	40	29
5	kildor	29	23
6	krasnova_anna	25	15
7	alexandrkochetkov	23	8
8	gyng	15	10
9	bespalov	8	8
10	anastasiyabaka	6	6`;

const projects = `
14 583
Birds of the Altai krai
7 452
Птицы Москвы и Подмосковья
5 540
Птицы Новосибирской области / Birds of Novosibirsk region
4 802
Птицы Нижегородской области
3 540
Птицы Томской области
3 015
Птицы Красноярского края
2 834
Birds of Chuvashia
2 711
Птицы Санкт-Петербурга и Ленинградской области
1 754
Птицы Татарстана \\ Birds of the Tatarstan
1 683
Птицы Удмуртской республики
1 621
Птицы Курской области
1 363
Птицы Республики Алтай
1 355
Птицы Башкирии
1 352
Птицы Кировской области
1 256
Рязанский клуб Птицы | Birds of Ryazan
1 135
Птицы Республики Карелия | Birds of Karelia Republic
1 118
Птицы Приморского края
1 075
Птицы Владимирской области | Birds of Vladimir region
1 021
Птицы Свердловской области
1 013
Птицы Кемеровской области / Birds of Kemerovo region
845
Птицы Волгоградской области
814
Birds of Kamchatka region Птицы Камчатского края
798
Птицы Крыма
654
Птицы Иркутской области / Birds of Irkutsk region
493
Птицы Чукотки
481
Птицы Амурской области
437
Птицы Омской области
427
Птицы Ульяновской области
406
Птицы Самарской области
381
Птицы Республики Бурятия
378
Птицы Ростовской области
374
Птицы Новгородской области / Birds of Novgorod Oblast
371
Птицы Краснодарского края
356
Птицы Липецкой области
347
Птицы Ярославской области
303
Птицы Пермского края/ Birds of Perm
283
Птицы Мурманской области
279
Птицы Калининградской области
277
Птицы ЯНАО | Birds of Yamal
263
Птицы Калмыкии
217
Птицы Вологодской области
188
Птицы Югры
185
Птицы Тюменской области
164
Птицы Ставропольского края
159
Птицы Челябинской области
158
Птицы Белгородской области
148
Птицы Воронежской области
142
Birds of Nenets Птицы НАО
140
Птицы Тверской области
138
Птицы Курганской области
136
Птицы Псковской области
133
Птицы Республики Саха (Якутия)
129
Птицы Республики Хакасия
123
Птицы Марий Эл
115
Птицы Мордовии
107
Птицы Калужской области
100
Птицы Сахалинской области
99
Птицы Дагестана
97
Птицы Ивановской области
84
Птицы Саратовской области
80
Птицы Забайкальского края
67
Птицы Брянской области
63
Птицы Архангельской области
63
Птицы Астраханской области
51
Птицы Оренбургской области
51
Птицы Хабаровского края
48
Птицы Магаданской области
42
Птицы Республики Тыва
37
Птицы Кабардино-Балкарии
29
Птицы Костромской области
28
Птицы Карачаево-Черкесии
26
Птицы Республики Коми
22
Птицы Смоленской области
21
Птицы Пензенской области
19
Птицы Тамбовской области
19
Птицы Тульской области
8
Птицы Чечни
5
Птицы Адыгеи
5
Птицы Еврейской АО
1
Птицы Орловской области
1
Птицы Северной Осетии
0
Птицы Ингушетии
`;
// const text = users;
const text = '';

  return (
    <div className="App">
      <header className="App-header">
          Скопируйте текст с таблицы iNaturalist и вставьте в левое поле ввода.
        </header>
      <main>
        <Converter text={text} />
      </main>
    </div>
  );
}

export default App;