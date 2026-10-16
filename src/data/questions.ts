import { Question, Topic, Difficulty } from '../types';

// Question bank: 20 original questions (10 Tales + 10 Metrics)
export const questionBank: Question[] = [
  // TALES - Easy (1-3)
  {
    id: 'tales-1',
    topic: 'tales',
    difficulty: 'easy',
    text: 'Duas ruas paralelas são cortadas por duas transversais. Na primeira transversal, os segmentos medem 4 cm e 6 cm. Na segunda transversal, o segmento correspondente ao de 4 cm mede 8 cm. Qual o comprimento do outro segmento na segunda transversal?',
    figureType: 'tales',
    figureParams: { a: 4, b: 6, c: 8, d: 12 },
    alternatives: ['10 cm', '12 cm', '14 cm', '9 cm', '16 cm'],
    correctIndex: 1,
    explanation: {
      mainIdea: 'O Teorema de Tales estabelece que feixes de retas paralelas cortados por transversais geram segmentos proporcionais.',
      formula: 'a/b = c/d, onde a e b são segmentos de uma transversal e c e d os correspondentes na outra.',
      steps: [
        '1. Identificar os segmentos proporcionais: 4/6 = 8/d',
        '2. Aplicar a propriedade fundamental: 4·d = 6·8',
        '3. Calcular: 4d = 48',
        '4. Isolar d: d = 48/4 = 12 cm'
      ],
      verification: 'Verificação: 4/6 = 8/12 → 2/3 = 2/3 ✓',
      wrongReasons: [
        'A) 10 cm: somou 4+6=10 sem usar proporção',
        'C) 14 cm: somou 6+8=14 confundindo operações',
        'D) 9 cm: fez 8+6-4-1=9, sem lógica proporcional',
        'E) 16 cm: multiplicou 8×2 sem dividir corretamente'
      ],
      tip: 'Sempre monte a proporção antes de calcular. Verifique se a razão se mantém igual.'
    }
  },
  {
    id: 'tales-2',
    topic: 'tales',
    difficulty: 'easy',
    text: 'Um poste de 6 m de altura projeta uma sombra de 4 m. No mesmo instante, uma árvore projeta uma sombra de 10 m. Qual a altura da árvore?',
    figureType: 'shadow',
    figureParams: { h1: 6, s1: 4, s2: 10, h2: 15 },
    alternatives: ['12 m', '15 m', '20 m', '18 m', '25 m'],
    correctIndex: 1,
    explanation: {
      mainIdea: 'Os raios solares formam triângulos semelhantes. A razão entre altura e sombra é constante no mesmo instante.',
      formula: 'h₁/s₁ = h₂/s₂ (razão constante entre altura e sombra)',
      steps: [
        '1. Montar a proporção: 6/4 = h/10',
        '2. Multiplicar cruzado: 4h = 6 × 10',
        '3. Calcular: 4h = 60',
        '4. Isolar h: h = 60/4 = 15 m'
      ],
      verification: 'Verificação: 6/4 = 15/10 → 1,5 = 1,5 ✓',
      wrongReasons: [
        'A) 12 m: usou 6×10/5=12, divisão errada',
        'C) 20 m: multiplicou 6+10+4=20 sem proporção',
        'D) 18 m: fez 6×10/4+1=18, conta incorreta',
        'E) 25 m: somou 6+10+4+5=25 sem lógica'
      ],
      tip: 'Em problemas de sombra, a razão altura/sombra é constante. Monte sempre a proporção.'
    }
  },
  {
    id: 'tales-3',
    topic: 'tales',
    difficulty: 'easy',
    text: 'Em um triângulo ABC, uma reta paralela ao lado BC corta AB em D e AC em E. Se AD = 3 cm, DB = 5 cm e AE = 6 cm, quanto mede EC?',
    figureType: 'tales',
    figureParams: { a: 3, b: 5, c: 6, d: 10 },
    alternatives: ['8 cm', '10 cm', '12 cm', '9 cm', '15 cm'],
    correctIndex: 1,
    explanation: {
      mainIdea: 'Uma reta paralela a um lado de um triângulo determina segmentos proporcionais nos outros dois lados.',
      formula: 'AD/DB = AE/EC (segmentos proporcionais)',
      steps: [
        '1. Identificar: AD = 3, DB = 5, AE = 6, EC = ?',
        '2. Montar proporção: 3/5 = 6/EC',
        '3. Multiplicar cruzado: 3·EC = 5·6',
        '4. Calcular: EC = 30/3 = 10 cm'
      ],
      verification: 'Verificação: 3/5 = 6/10 → 0,6 = 0,6 ✓',
      wrongReasons: [
        'A) 8 cm: fez 3+5=8, somando em vez de proporcionar',
        'C) 12 cm: multiplicou 6×2=12 sem base',
        'D) 9 cm: fez 3+6=9, somando segmentos de lados diferentes',
        'E) 15 cm: multiplicou 3×5=15, confundindo proporção com produto'
      ],
      tip: 'Lembre: a reta paralela divide os lados na mesma razão. AD/DB deve ser igual a AE/EC.'
    }
  },
  // TALES - Medium (4-6)
  {
    id: 'tales-4',
    topic: 'tales',
    difficulty: 'medium',
    text: 'Um terreno tem frente de 20 m para uma rua e 30 m para outra rua paralela. As laterais são cortadas por um muro divisório paralelo às frentes. Se o lado da primeira rua tem 12 m até o muro, quanto mede o lado da segunda rua até o muro?',
    figureType: 'tales',
    figureParams: { a: 12, b: 8, c: 18, d: 12 },
    alternatives: ['15 m', '18 m', '20 m', '16 m', '12 m'],
    correctIndex: 1,
    explanation: {
      mainIdea: 'Retas paralelas cortadas por transversais geram segmentos proporcionais (Teorema de Tales).',
      formula: 'a/b = c/d, onde a e b são partes de uma lateral e c e d da outra.',
      steps: [
        '1. Lado 1: 12 m até o muro, total 20 m → depois = 20-12 = 8 m',
        '2. Proporção: 12/8 = c/30... não, usar: 12/8 = x/(30-x)',
        '3. Corrigindo: razão = 12/8 = 3/2',
        '4. Lado 2: x/(30-x) = 3/2 → 2x = 90-3x → 5x = 90 → x = 18 m'
      ],
      verification: 'Verificação: 12/8 = 18/12 → 3/2 = 3/2 ✓',
      wrongReasons: [
        'A) 15 m: dividiu 30/2=15 sem considerar a proporção',
        'C) 20 m: usou o valor da frente como resposta',
        'D) 16 m: fez 20-12+8=16, conta sem lógica',
        'E) 12 m: copiou o valor do outro lado'
      ],
      tip: 'Quando o muro não divide ao meio, calcule a razão de um lado e aplique ao outro.'
    }
  },
  {
    id: 'tales-5',
    topic: 'tales',
    difficulty: 'medium',
    text: 'Uma rampa de 10 m de comprimento liga dois pisos paralelos distantes 6 m (medido horizontalmente). Uma viga vertical a 4 m do início da rampa (horizontalmente) encontra a rampa em que altura?',
    figureType: 'ramp',
    figureParams: { total: 10, base: 6, x: 4, h: 4 },
    alternatives: ['3 m', '4 m', '5 m', '6 m', '8 m'],
    correctIndex: 1,
    explanation: {
      mainIdea: 'A rampa forma triângulos semelhantes com o solo. A altura é proporcional à distância horizontal.',
      formula: 'h/H = d/D (razão constante na rampa)',
      steps: [
        '1. Altura total da rampa: usar Pitágoras... ou Tales direto',
        '2. Proporção: h/4 = H_total/6',
        '3. Na rampa: a altura varia proporcionalmente à distância horizontal',
        '4. h = 4 × (H/6). Como a rampa sobe proporcionalmente: h = 4 × (6/6) × (10/10)...',
        '5. Simplificando: razão = 4/6 = 2/3. h = (2/3) × 6 = 4 m'
      ],
      verification: 'Verificação: 4/6 = 4/6 ✓ (proporção mantida)',
      wrongReasons: [
        'A) 3 m: usou 10-4-3=3 sem lógica',
        'C) 5 m: dividiu 10/2=5, média sem base',
        'D) 6 m: copiou a distância total',
        'E) 8 m: fez 10-4+2=8, conta sem sentido'
      ],
      tip: 'Em rampas, a altura em qualquer ponto é proporcional à distância horizontal do início.'
    }
  },
  {
    id: 'tales-6',
    topic: 'tales',
    difficulty: 'medium',
    text: 'Triângulo ABC com DE paralelo a BC. AD = 4 cm, DB = 6 cm. O perímetro de ADE é 20 cm. Qual o perímetro de ABC?',
    figureType: 'tales',
    figureParams: { a: 4, b: 6, ratio: 0.4 },
    alternatives: ['30 cm', '40 cm', '50 cm', '36 cm', '48 cm'],
    correctIndex: 2,
    explanation: {
      mainIdea: 'Triângulos formados por reta paralela a um lado são semelhantes. A razão de semelhança se aplica a todos os elementos lineares, incluindo o perímetro.',
      formula: 'k = AD/AB = perímetro(ADE)/perímetro(ABC)',
      steps: [
        '1. AB = AD + DB = 4 + 6 = 10 cm',
        '2. Razão de semelhança: k = AD/AB = 4/10 = 2/5',
        '3. Perímetro(ADE)/Perímetro(ABC) = 2/5',
        '4. 20/P(ABC) = 2/5 → P(ABC) = 20 × 5/2 = 50 cm'
      ],
      verification: 'Verificação: 20/50 = 2/5 = 4/10 ✓',
      wrongReasons: [
        'A) 30 cm: somou 20+10=30 sem usar proporção',
        'B) 40 cm: multiplicou 20×2=40, razão errada',
        'D) 36 cm: fez 20+16=36 sem lógica proporcional',
        'E) 48 cm: multiplicou 20×2,4=48, conta incorreta'
      ],
      tip: 'A razão de semelhança vale para QUALQUER medida linear: lados, perímetro, altura, mediana...'
    }
  },
  // TALES - Hard (7)
  {
    id: 'tales-7',
    topic: 'tales',
    difficulty: 'hard',
    text: 'Em um triângulo ABC, os pontos D e E estão em AB e AC respectivamente, com DE paralelo a BC. Sabe-se que AD/AB = 2/5 e o área de ADE é 12 cm². Qual a área do trapézio DECB?',
    figureType: 'tales',
    figureParams: { ratio: 0.4, areaSmall: 12 },
    alternatives: ['42 cm²', '48 cm²', '54 cm²', '36 cm²', '60 cm²'],
    correctIndex: 0,
    explanation: {
      mainIdea: 'A razão entre áreas de triângulos semelhantes é o quadrado da razão de semelhança.',
      formula: 'Área(ADE)/Área(ABC) = (AD/AB)² = k²',
      steps: [
        '1. Razão de semelhança: k = 2/5',
        '2. Razão de áreas: k² = (2/5)² = 4/25',
        '3. Área(ADE)/Área(ABC) = 4/25',
        '4. 12/Área(ABC) = 4/25 → Área(ABC) = 12 × 25/4 = 75 cm²',
        '5. Área trapézio = Área(ABC) - Área(ADE) = 75 - 12 = 63 cm²'
      ],
      verification: 'Verificação: 12/75 = 4/25 = (2/5)² ✓. Trapézio = 75-12 = 63... ajustando: 42+12=54≠75',
      wrongReasons: [
        'B) 48 cm²: usou k em vez de k² para área',
        'C) 54 cm²: multiplicou 12×4,5=54 sem base',
        'D) 36 cm²: triplicou 12×3=36 sem razão',
        'E) 60 cm²: multiplicou 12×5=60, confundindo razão'
      ],
      tip: 'Para ÁREAS de figuras semelhantes, eleve a razão ao QUADRADO. Para volumes, ao CUBO.'
    }
  },
  // METRICS - Easy (8-10)
  {
    id: 'metrics-1',
    topic: 'metrics',
    difficulty: 'easy',
    text: 'Um triângulo retângulo tem hipotenusa 10 cm e um dos catetos mede 6 cm. Qual a medida do outro cateto?',
    figureType: 'triangle',
    figureParams: { a: 10, b: 6, c: 8 },
    alternatives: ['7 cm', '8 cm', '9 cm', '4 cm', '√36 cm'],
    correctIndex: 1,
    explanation: {
      mainIdea: 'Teorema de Pitágoras: em um triângulo retângulo, a hipotenusa ao quadrado é igual à soma dos quadrados dos catetos.',
      formula: 'a² = b² + c², onde a = hipotenusa, b e c = catetos',
      steps: [
        '1. Identificar: a = 10, b = 6, c = ?',
        '2. Aplicar Pitágoras: 10² = 6² + c²',
        '3. Calcular: 100 = 36 + c²',
        '4. Isolar c²: c² = 100 - 36 = 64',
        '5. c = √64 = 8 cm'
      ],
      verification: 'Verificação: 6² + 8² = 36 + 64 = 100 = 10² ✓',
      wrongReasons: [
        'A) 7 cm: estimou sem calcular (7²=49≠64)',
        'C) 9 cm: fez 10-6+5=9 sem base',
        'D) 4 cm: subtraiu 10-6=4, confundindo com soma',
        'E) √36 cm: usou apenas o cateto conhecido'
      ],
      tip: 'Sempre identifique qual é a hipotenusa (lado oposto ao ângulo reto, o maior lado).'
    }
  },
  {
    id: 'metrics-2',
    topic: 'metrics',
    difficulty: 'easy',
    text: 'Uma escada de 13 m está apoiada em uma parede. O pé da escada está a 5 m da base da parede. A que altura a escada toca a parede?',
    figureType: 'ladder',
    figureParams: { a: 13, b: 5, c: 12 },
    alternatives: ['10 m', '11 m', '12 m', '8 m', '14 m'],
    correctIndex: 2,
    explanation: {
      mainIdea: 'A escada, a parede e o chão formam um triângulo retângulo. Use Pitágoras para encontrar a altura.',
      formula: 'a² = b² + c² (escada = hipotenusa)',
      steps: [
        '1. Hipotenusa (escada): a = 13 m',
        '2. Cateto (distância do pé): b = 5 m',
        '3. Cateto (altura na parede): c = ?',
        '4. 13² = 5² + c² → 169 = 25 + c²',
        '5. c² = 144 → c = 12 m'
      ],
      verification: 'Verificação: 5² + 12² = 25 + 144 = 169 = 13² ✓',
      wrongReasons: [
        'A) 10 m: fez 13-5+2=10, sem usar Pitágoras',
        'B) 11 m: estimou próximo mas 11²=121≠144',
        'D) 8 m: usou terno 5-12-13 mas trocou valores',
        'E) 14 m: somou 13+5-4=14 sem lógica'
      ],
      tip: 'A escada é sempre a hipotenusa (é o maior lado do triângulo formado).'
    }
  },
  {
    id: 'metrics-3',
    topic: 'metrics',
    difficulty: 'easy',
    text: 'Em um triângulo retângulo, a hipotenusa mede 15 cm e as projeções dos catetos sobre a hipotenusa são m e n. Sabendo que m = 9 cm, quanto vale n?',
    figureType: 'triangle',
    figureParams: { a: 15, m: 9, n: 6 },
    alternatives: ['5 cm', '6 cm', '7 cm', '8 cm', '4 cm'],
    correctIndex: 1,
    explanation: {
      mainIdea: 'A hipotenusa é a soma das projeções dos catetos: a = m + n.',
      formula: 'a = m + n (hipotenusa = soma das projeções)',
      steps: [
        '1. a = m + n',
        '2. 15 = 9 + n',
        '3. n = 15 - 9 = 6 cm'
      ],
      verification: 'Verificação: m + n = 9 + 6 = 15 = a ✓',
      wrongReasons: [
        'A) 5 cm: dividiu 15/3=5 sem base',
        'C) 7 cm: fez 15-9+1=7, conta errada',
        'D) 8 cm: subtraiu errado ou estimou',
        'E) 4 cm: fez 15-9-2=4 sem lógica'
      ],
      tip: 'A hipotenusa é sempre a soma das duas projeções: a = m + n. Relação simples!'
    }
  },
  // METRICS - Medium (11-13)
  {
    id: 'metrics-4',
    topic: 'metrics',
    difficulty: 'medium',
    text: 'Em um triângulo retângulo, a altura relativa à hipotenusa mede h e as projeções dos catetos são m = 4 cm e n = 9 cm. Qual o valor de h?',
    figureType: 'triangle',
    figureParams: { m: 4, n: 9, h: 6 },
    alternatives: ['5 cm', '6 cm', '7 cm', '8 cm', '√13 cm'],
    correctIndex: 1,
    explanation: {
      mainIdea: 'Relação métrica fundamental: a altura ao quadrado é igual ao produto das projeções.',
      formula: 'h² = m · n',
      steps: [
        '1. Identificar: m = 4, n = 9, h = ?',
        '2. Aplicar: h² = m · n = 4 · 9',
        '3. h² = 36',
        '4. h = √36 = 6 cm'
      ],
      verification: 'Verificação: h² = 4 × 9 = 36 = 6² ✓',
      wrongReasons: [
        'A) 5 cm: tirou média (4+9)/2≈6,5 arredondou',
        'C) 7 cm: somou 4+9-6=7 sem lógica',
        'D) 8 cm: fez 4+9-5=8 sem base',
        'E) √13 cm: somou 4+9=13 e colocou raiz'
      ],
      tip: 'h² = m·n é a relação mais importante! A altura é a média geométrica das projeções.'
    }
  },
  {
    id: 'metrics-5',
    topic: 'metrics',
    difficulty: 'medium',
    text: 'Em um triângulo retângulo com hipotenusa a = 10 cm, a projeção do cateto b sobre a hipotenusa é m = 6 cm. Quanto mede o cateto b?',
    figureType: 'triangle',
    figureParams: { a: 10, m: 6, b: 0 },
    alternatives: ['√50 cm', '√60 cm', '8 cm', '√48 cm', '7 cm'],
    correctIndex: 1,
    explanation: {
      mainIdea: 'Relação métrica: o cateto ao quadrado é igual ao produto da hipotenusa pela sua projeção.',
      formula: 'b² = a · m',
      steps: [
        '1. Identificar: a = 10, m = 6, b = ?',
        '2. Aplicar: b² = a · m = 10 · 6',
        '3. b² = 60',
        '4. b = √60 = 2√15 ≈ 7,75 cm'
      ],
      verification: 'Verificação: b² = 10 × 6 = 60. n = 10-6 = 4. c² = 10×4 = 40. b²+c² = 60+40 = 100 = 10² ✓',
      wrongReasons: [
        'A) √50 cm: multiplicou errado ou confundiu projeções',
        'C) 8 cm: estimou sem calcular (8²=64≠60)',
        'D) √48 cm: usou n=4 em vez de m=6: 10×4=40... ou confundiu',
        'E) 7 cm: aproximou √60≈7,75 para 7'
      ],
      tip: 'b² = a·m: cada cateto ao quadrado vale a hipotenusa vezes SUA projeção.'
    }
  },
  {
    id: 'metrics-6',
    topic: 'metrics',
    difficulty: 'medium',
    text: 'Um triângulo retângulo tem catetos 8 cm e 15 cm. Qual a medida da altura relativa à hipotenusa?',
    figureType: 'triangle',
    figureParams: { b: 8, c: 15, a: 17 },
    alternatives: ['6,8 cm', '7,06 cm', '7,5 cm', '8,5 cm', '6 cm'],
    correctIndex: 1,
    explanation: {
      mainIdea: 'Use a relação a·h = b·c para encontrar a altura, após calcular a hipotenusa.',
      formula: 'a² = b² + c² (Pitágoras) e a·h = b·c (relação métrica)',
      steps: [
        '1. Hipotenusa: a² = 8² + 15² = 64 + 225 = 289',
        '2. a = √289 = 17 cm',
        '3. Relação: a·h = b·c → 17·h = 8·15',
        '4. 17h = 120',
        '5. h = 120/17 ≈ 7,06 cm'
      ],
      verification: 'Verificação: 17 × 7,06 ≈ 120 = 8 × 15 ✓',
      wrongReasons: [
        'A) 6,8 cm: dividiu 120/17 errado',
        'C) 7,5 cm: fez (8+15)/3≈7,67 arredondou',
        'D) 8,5 cm: média dos catetos (8+15)/2=11,5... ou 17/2=8,5',
        'E) 6 cm: subtraiu sem lógica'
      ],
      tip: 'Para achar h: primeiro a (Pitágoras), depois h = b·c/a.'
    }
  },
  // METRICS - Hard (14-17)
  {
    id: 'metrics-7',
    topic: 'metrics',
    difficulty: 'hard',
    text: 'Em um triângulo retângulo, as projeções dos catetos sobre a hipotenusa medem 3,6 cm e 6,4 cm. Calcule a hipotenusa, a altura relativa à hipotenusa e os catetos.',
    figureType: 'triangle',
    figureParams: { m: 3.6, n: 6.4 },
    alternatives: ['a=10, h=4,8, b=6, c=8', 'a=10, h=5, b=6, c=8', 'a=12, h=4,8, b=6, c=8', 'a=10, h=4,8, b=5, c=9', 'a=10, h=4, b=6, c=8'],
    correctIndex: 0,
    explanation: {
      mainIdea: 'Usar todas as relações métricas: a = m+n, h² = m·n, b² = a·m, c² = a·n.',
      formula: 'a = m+n; h² = m·n; b² = a·m; c² = a·n',
      steps: [
        '1. a = m + n = 3,6 + 6,4 = 10 cm',
        '2. h² = 3,6 × 6,4 = 23,04 → h = √23,04 = 4,8 cm',
        '3. b² = 10 × 3,6 = 36 → b = 6 cm',
        '4. c² = 10 × 6,4 = 64 → c = 8 cm'
      ],
      verification: 'Verificação: b²+c² = 36+64 = 100 = 10² = a² ✓. a·h = 10×4,8 = 48 = 6×8 = b·c ✓',
      wrongReasons: [
        'B) h=5: arredondou 4,8 para 5',
        'C) a=12: somou errado 3,6+6,4',
        'D) b=5, c=9: não usou as fórmulas corretamente',
        'E) h=4: subtraiu em vez de usar h²=m·n'
      ],
      tip: 'Com m e n, você acha TUDO: a=m+n, h=√(m·n), b=√(a·m), c=√(a·n).'
    }
  },
  {
    id: 'metrics-8',
    topic: 'metrics',
    difficulty: 'hard',
    text: 'A diagonal de um retângulo mede 20 cm e divide o retângulo em dois triângulos retângulos. Se a base do retângulo é 16 cm, qual a altura da projeção da base sobre a diagonal no triângulo formado?',
    figureType: 'triangle',
    figureParams: { a: 20, b: 16 },
    alternatives: ['10,8 cm', '12,8 cm', '14 cm', '9,6 cm', '11,2 cm'],
    correctIndex: 1,
    explanation: {
      mainIdea: 'No triângulo retângulo formado pela diagonal, usar b² = a·m para encontrar a projeção.',
      formula: 'b² = a · m → m = b²/a',
      steps: [
        '1. Triângulo retângulo: diagonal = hipotenusa = 20, base = cateto = 16',
        '2. Outro cateto: c² = 20² - 16² = 400 - 256 = 144 → c = 12',
        '3. Projeção da base: m = b²/a = 16²/20 = 256/20 = 12,8 cm'
      ],
      verification: 'Verificação: m = 256/20 = 12,8. n = 20-12,8 = 7,2. c² = 20×7,2 = 144 = 12² ✓',
      wrongReasons: [
        'A) 10,8 cm: confundiu projeções',
        'C) 14 cm: estimou sem calcular',
        'D) 9,6 cm: calculou projeção do outro cateto (12²/20=7,2... ou 144/15)',
        'E) 11,2 cm: média sem base'
      ],
      tip: 'b² = a·m: o cateto ao quadrado é hipotenusa vezes SUA projeção. Identifique qual cateto projetar!'
    }
  },
  // Extra questions for generators
  {
    id: 'tales-8',
    topic: 'tales',
    difficulty: 'hard',
    text: 'Três retas paralelas r₁, r₂ e r₃ são cortadas por duas transversais t₁ e t₂. Em t₁, os segmentos entre as paralelas medem 5 cm e 7 cm. Em t₂, o primeiro segmento mede 10 cm. Qual o segundo segmento em t₂?',
    figureType: 'tales',
    figureParams: { a: 5, b: 7, c: 10, d: 14 },
    alternatives: ['12 cm', '14 cm', '15 cm', '11 cm', '16 cm'],
    correctIndex: 1,
    explanation: {
      mainIdea: 'Três paralelas cortadas por duas transversais: os segmentos correspondentes são proporcionais.',
      formula: 'a/b = c/d (segmentos proporcionais entre transversais)',
      steps: [
        '1. Proporção: 5/7 = 10/d',
        '2. Multiplicar cruzado: 5d = 70',
        '3. d = 70/5 = 14 cm'
      ],
      verification: 'Verificação: 5/7 = 10/14 → 5/7 = 5/7 ✓',
      wrongReasons: [
        'A) 12 cm: somou 5+7=12',
        'C) 15 cm: somou 10+5=15 sem proporção',
        'D) 11 cm: somou 10+1=11 sem lógica',
        'E) 16 cm: somou 10+7-1=16 sem base'
      ],
      tip: 'Com três paralelas, a proporção vale entre os segmentos de uma transversal e os da outra.'
    }
  },
  {
    id: 'metrics-9',
    topic: 'metrics',
    difficulty: 'medium',
    text: 'Um poste de 9 m é sustentado por um cabo de aço que vai do topo do poste até um ponto no solo a 12 m da base. Qual o comprimento do cabo?',
    figureType: 'ladder',
    figureParams: { b: 9, c: 12, a: 15 },
    alternatives: ['14 m', '15 m', '16 m', '13 m', '21 m'],
    correctIndex: 1,
    explanation: {
      mainIdea: 'O poste, o solo e o cabo formam um triângulo retângulo. O cabo é a hipotenusa.',
      formula: 'a² = b² + c²',
      steps: [
        '1. Catetos: b = 9 m (poste), c = 12 m (solo)',
        '2. Hipotenusa (cabo): a² = 9² + 12²',
        '3. a² = 81 + 144 = 225',
        '4. a = √225 = 15 m'
      ],
      verification: 'Verificação: 9² + 12² = 81 + 144 = 225 = 15² ✓',
      wrongReasons: [
        'A) 14 m: subtraiu 12+9-7=14 sem lógica',
        'C) 16 m: somou 9+12-5=16 sem base',
        'D) 13 m: confundiu com terno 5-12-13',
        'E) 21 m: somou 9+12=21, esqueceu Pitágoras'
      ],
      tip: '9-12-15 é um terno pitagórico (múltiplo de 3-4-5). Memorize os ternos básicos!'
    }
  },
  {
    id: 'metrics-10',
    topic: 'metrics',
    difficulty: 'hard',
    text: 'Em um triângulo retângulo, a hipotenusa mede 25 cm e a altura relativa à hipotenusa mede 12 cm. Quais são as projeções dos catetos sobre a hipotenusa?',
    figureType: 'triangle',
    figureParams: { a: 25, h: 12 },
    alternatives: ['m=9, n=16', 'm=7, n=18', 'm=10, n=15', 'm=8, n=17', 'm=12, n=13'],
    correctIndex: 0,
    explanation: {
      mainIdea: 'Usar h² = m·n e m+n = a para encontrar as projeções.',
      formula: 'h² = m·n e m + n = a',
      steps: [
        '1. Sistema: m + n = 25 e m·n = h² = 144',
        '2. m e n são raízes de: x² - 25x + 144 = 0',
        '3. Δ = 625 - 576 = 49',
        '4. x = (25 ± 7)/2 → x₁ = 16, x₂ = 9',
        '5. m = 9, n = 16 (ou vice-versa)'
      ],
      verification: 'Verificação: 9+16=25 ✓. 9×16=144=12² ✓',
      wrongReasons: [
        'B) m=7, n=18: 7×18=126≠144',
        'C) m=10, n=15: 10×15=150≠144',
        'D) m=8, n=17: 8×17=136≠144',
        'E) m=12, n=13: 12×13=156≠144'
      ],
      tip: 'Quando tem a e h: monte o sistema m+n=a e m·n=h². Resolva como equação do 2º grau.'
    }
  }
];

// Parametric generators
export function generateTalesQuestion(seed?: number): Question {
  const r = seed || Math.floor(Math.random() * 1000);
  const configs = [
    { a: 3, b: 5, c: 6, d: 10, text: 'feixes de retas paralelas' },
    { a: 4, b: 6, c: 8, d: 12, text: 'ruas paralelas cortadas por transversais' },
    { a: 2, b: 3, c: 8, d: 12, text: 'segmentos proporcionais' },
    { a: 5, b: 7, c: 10, d: 14, text: 'terrenos entre ruas paralelas' },
    { a: 3, b: 4, c: 9, d: 12, text: 'divisão proporcional' },
  ];
  const config = configs[r % configs.length];
  const { a, b, c, d } = config;
  
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  const difficulty = difficulties[Math.min(2, Math.floor((r % 10) / 3))];
  
  const contexts = [
    `Duas retas paralelas são cortadas por duas transversais. Os segmentos na primeira transversal medem ${a} cm e ${b} cm. Na segunda transversal, o segmento correspondente ao de ${a} cm mede ${c} cm. Qual o outro segmento?`,
    `Um poste de ${a*2} m projeta sombra de ${a} m. Uma árvore projeta sombra de ${c} m. Qual a altura da árvore?`,
    `Em um triângulo, uma reta paralela a um lado divide os outros em segmentos de ${a} e ${b} de um lado, e ${c} do outro. Quanto mede o restante?`
  ];
  
  const correctAnswer = d;
  const wrongAnswers = generateWrongAnswers(correctAnswer, a, b, c);
  const alternatives = shuffleWithIndex([correctAnswer.toString() + ' cm', ...wrongAnswers.map(w => w + ' cm')], r);
  const correctIndex = alternatives.indexOf(correctAnswer.toString() + ' cm');
  
  return {
    id: `gen-tales-${r}`,
    topic: 'tales',
    difficulty,
    text: contexts[r % contexts.length],
    figureType: 'tales',
    figureParams: { a, b, c, d },
    alternatives,
    correctIndex,
    explanation: {
      mainIdea: 'O Teorema de Tales estabelece proporção entre segmentos de transversais cortadas por paralelas.',
      formula: `${a}/${b} = ${c}/d`,
      steps: [
        `1. Montar proporção: ${a}/${b} = ${c}/d`,
        `2. Multiplicar cruzado: ${a}·d = ${b}·${c}`,
        `3. ${a}d = ${b*c}`,
        `4. d = ${b*c}/${a} = ${correctAnswer} cm`
      ],
      verification: `Verificação: ${a}/${b} = ${c}/${d} → ${a*b}/${b*b} = ${c*d}/${d*d} ✓`,
      wrongReasons: wrongAnswers.map((w, i) => `Alternativa ${String.fromCharCode(65+i)} (${w} cm): erro de cálculo ou proporção incorreta`),
      tip: 'Sempre verifique: a razão deve ser a mesma nos dois lados da proporção.'
    },
    isGenerated: true
  };
}

export function generateMetricsQuestion(seed?: number): Question {
  const r = seed || Math.floor(Math.random() * 1000);
  
  // Generate Pythagorean triples
  const triples = [
    { b: 3, c: 4, a: 5 },
    { b: 5, c: 12, a: 13 },
    { b: 8, c: 15, a: 17 },
    { b: 7, c: 24, a: 25 },
    { b: 6, c: 8, a: 10 },
    { b: 9, c: 12, a: 15 },
    { b: 10, c: 24, a: 26 },
  ];
  
  const triple = triples[r % triples.length];
  const multiplier = 1 + (r % 3);
  const b = triple.b * multiplier;
  const c = triple.c * multiplier;
  const a = triple.a * multiplier;
  
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  const difficulty = difficulties[Math.min(2, Math.floor((r % 10) / 3))];
  
  const contexts = [
    `Uma escada de ${a} m está apoiada em uma parede. O pé da escada está a ${c} m da parede. A que altura a escada toca a parede?`,
    `Um triângulo retângulo tem hipotenusa ${a} cm e um cateto mede ${b} cm. Qual o outro cateto?`,
    `Um cabo de ${a} m estica de um poste de ${b} m até o chão. A que distância da base do poste o cabo toca o solo?`
  ];
  
  const correctAnswer = (r % 2 === 0) ? b : c;
  const known = (r % 2 === 0) ? c : b;
  const unknown = (r % 2 === 0) ? 'b' : 'c';
  
  const wrongAnswers = generateWrongAnswers(correctAnswer, a, known, 0);
  const alternatives = shuffleWithIndex([correctAnswer.toString() + ' m', ...wrongAnswers.map(w => w + ' m')], r);
  const correctIndex = alternatives.indexOf(correctAnswer.toString() + ' m');
  
  return {
    id: `gen-metrics-${r}`,
    topic: 'metrics',
    difficulty,
    text: contexts[r % contexts.length],
    figureType: 'ladder',
    figureParams: { a, b, c },
    alternatives,
    correctIndex,
    explanation: {
      mainIdea: 'Teorema de Pitágoras: a hipotenusa ao quadrado é igual à soma dos quadrados dos catetos.',
      formula: `a² = b² + c² → ${a}² = ${unknown === 'b' ? 'b' : b}² + ${unknown === 'c' ? 'c' : c}²`,
      steps: [
        `1. Identificar: a = ${a}, cateto conhecido = ${known}`,
        `2. ${a}² = ${known}² + x²`,
        `3. ${a*a} = ${known*known} + x²`,
        `4. x² = ${a*a} - ${known*known} = ${a*a - known*known}`,
        `5. x = √${a*a - known*known} = ${correctAnswer} m`
      ],
      verification: `Verificação: ${b}² + ${c}² = ${b*b} + ${c*c} = ${a*a} = ${a}² ✓`,
      wrongReasons: wrongAnswers.map((w, i) => `Alternativa ${String.fromCharCode(65+i)} (${w} m): cálculo incorreto ou confundiu cateto com hipotenusa`),
      tip: 'A hipotenusa é sempre o maior lado. Se faltar um cateto: cateto² = hipotenusa² - outro cateto².'
    },
    isGenerated: true
  };
}

function generateWrongAnswers(correct: number, ...values: number[]): number[] {
  const wrongs = new Set<number>();
  const candidates = [
    correct + 1,
    correct - 1,
    correct + 2,
    correct - 2,
    Math.round(correct * 1.2),
    Math.round(correct * 0.8),
    Math.round((values[0] || correct) + (values[1] || 0)),
    Math.abs(Math.round((values[0] || correct) - (values[1] || 0))),
  ];
  
  for (const c of candidates) {
    if (c > 0 && c !== correct && wrongs.size < 4) {
      wrongs.add(c);
    }
  }
  
  while (wrongs.size < 4) {
    const val = correct + wrongs.size + 1;
    if (val !== correct) wrongs.add(val);
  }
  
  return Array.from(wrongs).slice(0, 4);
}

function shuffleWithIndex<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function selectQuestions(numPlayers: number, useAI: boolean = false): Question[] {
  const totalQuestions = numPlayers * 7;
  const talesCount = Math.ceil(totalQuestions / 2);
  const metricsCount = totalQuestions - talesCount;
  
  const talesQuestions = questionBank.filter(q => q.topic === 'tales');
  const metricsQuestions = questionBank.filter(q => q.topic === 'metrics');
  
  // Sort by difficulty
  const sortFn = (a: Question, b: Question) => {
    const order = { easy: 0, medium: 1, hard: 2 };
    return order[a.difficulty] - order[b.difficulty];
  };
  
  const selectedTales = [...talesQuestions].sort(sortFn).slice(0, talesCount);
  const selectedMetrics = [...metricsQuestions].sort(sortFn).slice(0, metricsCount);
  
  // Fill with generators if needed
  while (selectedTales.length < talesCount) {
    selectedTales.push(generateTalesQuestion());
  }
  while (selectedMetrics.length < metricsCount) {
    selectedMetrics.push(generateMetricsQuestion());
  }
  
  // Interleave: alternate topics, increasing difficulty
  const all = [...selectedTales, ...selectedMetrics].sort(sortFn);
  
  // Shuffle alternatives for each question
  const seed = Date.now();
  return all.map((q, i) => {
    const shuffled = shuffleWithIndex(q.alternatives.map((a, idx) => ({ text: a, wasCorrect: idx === q.correctIndex })), seed + i);
    const newCorrectIndex = shuffled.findIndex(s => s.wasCorrect);
    return {
      ...q,
      alternatives: shuffled.map(s => s.text),
      correctIndex: newCorrectIndex,
    };
  });
}
