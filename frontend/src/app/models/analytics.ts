// models/analytics.ts
export interface CardMetrics {
  foco_atual_qtd: number;
  ritmo_jornada_dias: number;
  pontos_destrava_qtd: number;
  saude_estimativas_pct: number;
}

export interface EffortData {
  status: string;
  quantidade: number;
}

export interface RitmoSeries {
  sprints: string[];
  dias_gastos: number[];
  meta_esperada: number[];
}

export interface RitmoChart {
  titulo: string;
  series: RitmoSeries;
}

export interface EsforcoChart {
  titulo: string;
  dados: EffortData[];
}

export interface MentoradoData {
  cards: CardMetrics;
  grafico_esforco: EsforcoChart;
  grafico_ritmo: RitmoChart;
}

export interface AnalyticsResponse {
  visao_geral: {
    cards: CardMetrics;
    grafico_esforco: EsforcoChart;
    grafico_ritmo: RitmoChart;
  };
  visao_mentorada: Record<string, MentoradoData>;
}
