import pandas as pd
import plotly.express as px
from dash import Dash, dcc, html, Input, Output
import datetime
import numpy as np

# --- 1. Definir Cores do CSS (baseado no style.css fornecido) ---
# :root { --color-unity1: #08141d; --color-unity2: #e76f24; --color-unity3: #4b4278; --color-unity4: #ae244b; --color-unity5: #8eac30; --color-light: #ffffff; --color-dark: #000000; }
colors = {
    'unity1': '#08141d',
    'unity2': '#e76f24',
    'unity3': '#4b4278',
    'unity4': '#ae244b',
    'unity5': '#8eac30',
    'light': '#ffffff',
    'dark': '#000000'
}

# --- 2. Simular Dados Aprimorados ---
communities = [
    "Vila Progresso", "Morada do Sol", "Ponte Nova", "Campo Verde", "Bairro Feliz",
    "Santa Luzia", "Recanto das Flores", "Cidade Jardim", "Vale Encantado", "Porto Seguro",
    "Serra Dourada", "Rio Claro" # Adicionado mais comunidades
]

data_types = [ # Agora chamadas de Áreas de Atividade
    "Saúde", "Educação", "Infraestrutura Urbana", "Geração de Emprego", "Saneamento Básico",
    "Cultura e Lazer", "Segurança Pública", "Desenvolvimento Sustentável",
    "Assistência Social", "Habitação", "Meio Ambiente", "Transporte" # Adicionado mais áreas
]

start_date = datetime.date(2023, 1, 1)
end_date = datetime.date(2024, 12, 31)
date_range = pd.date_range(start=start_date, end=end_date, freq='ME') # 'ME' para fim do mês

data = []

for community in communities:
    for data_type in data_types:
        for date in date_range:
            # Simular Investimento (Milhões R$)
            base_investment = 0.5 + np.random.rand() * 2 # Entre 0.5 e 2.5 milhões
            # Adicionar alguma variação por tipo de dado e ao longo do tempo
            if data_type == "Infraestrutura Urbana":
                investment = base_investment * (1 + (date.year - 2023) * 0.2 + np.random.rand() * 0.5)
            elif data_type == "Educação":
                investment = base_investment * (1 + (date.year - 2023) * 0.15 + np.random.rand() * 0.4)
            elif data_type == "Geração de Emprego":
                investment = base_investment * (1 + (date.year - 2023) * 0.25 + np.random.rand() * 0.6)
            else:
                investment = base_investment * (1 + np.random.rand() * 0.3)
            investment = round(max(0.1, investment), 2) # Garante valor mínimo e arredonda

            # Simular Número de Beneficiários
            base_beneficiaries = 100 + np.random.randint(-50, 50)
            if data_type == "Saúde":
                beneficiaries = base_beneficiaries * (1 + (date.year - 2023) * 0.1) + np.random.randint(0, 100)
            else:
                beneficiaries = base_beneficiaries + np.random.randint(-20, 20)
            beneficiaries = max(10, int(beneficiaries)) # Garante valor mínimo inteiro

            # Simular Projetos Realizados
            projects = np.random.randint(1, 5) # 1 a 4 projetos por mês
            if data_type == "Infraestrutura Urbana" or data_type == "Desenvolvimento Sustentável":
                projects += np.random.randint(0, 2) # Mais projetos para estas áreas
            projects = max(1, int(projects))

            data.append([community, data_type, date, investment, beneficiaries, projects])

df = pd.DataFrame(data, columns=["Comunidade", "Área de Atividade", "Data", "Investimento (Milhões R$)", "Número de Beneficiários", "Projetos Realizados"])

# --- 3. Inicializar o Aplicativo Dash e Layout ---
app = Dash(__name__)

app.layout = html.Div(style={'backgroundColor': colors['light'], 'color': colors['dark'], 'fontFamily': 'Arial, sans-serif'}, children=[
    html.Div(style={'backgroundColor': colors['unity1'], 'padding': '20px', 'textAlign': 'center', 'color': colors['light']}, children=[
        html.H1("Dashboard de Diagnóstico Socioeconômico Comunitário - Unity+", style={'margin': '0'}),
        html.P("Análise Visual e Estratégica de Métricas Comunitárias", style={'marginTop': '5px'})
    ]),

    html.Div(style={'padding': '20px', 'backgroundColor': '#f0f0f0', 'borderRadius': '8px', 'margin': '20px'}, children=[
        html.H3("Filtros de Análise", style={'marginBottom': '15px', 'color': colors['unity3']}),
        html.Div(style={'display': 'flex', 'flexWrap': 'wrap', 'gap': '20px', 'justifyContent': 'space-around'}, children=[
            html.Div(style={'width': '300px'}, children=[
                html.Label("Selecione a Comunidade:", style={'fontWeight': 'bold', 'color': colors['dark']}),
                dcc.Dropdown(
                    id='community-dropdown',
                    options=[{'label': 'Todas as Comunidades', 'value': 'Todas as Comunidades'}] + [{'label': i, 'value': i} for i in communities],
                    value='Todas as Comunidades',  # Valor padrão
                    clearable=False,
                    style={'backgroundColor': colors['light'], 'borderColor': colors['unity2']}
                ),
            ]),
            html.Div(style={'width': '300px'}, children=[
                html.Label("Selecione a Área de Atividade:", style={'fontWeight': 'bold', 'color': colors['dark']}),
                dcc.Dropdown(
                    id='data-type-dropdown',
                    options=[{'label': 'Todas as Áreas', 'value': 'Todas as Áreas'}] + [{'label': i, 'value': i} for i in data_types],
                    value='Todas as Áreas',  # Valor padrão
                    clearable=False,
                    style={'backgroundColor': colors['light'], 'borderColor': colors['unity2']}
                ),
            ]),
            html.Div(style={'width': '300px'}, children=[
                html.Label("Selecione o Período:", style={'fontWeight': 'bold', 'color': colors['dark']}),
                dcc.DatePickerRange(
                    id='date-picker-range',
                    min_date_allowed=start_date,
                    max_date_allowed=end_date,
                    initial_visible_month=start_date,
                    start_date=start_date,
                    end_date=end_date,
                    display_format='DD/MM/YYYY',
                    style={'border': f'1px solid {colors["unity2"]}', 'borderRadius': '4px', 'padding': '5px'}
                ),
            ]),
            html.Div(style={'width': '300px'}, children=[
                html.Label("Selecione o Tipo de Gráfico:", style={'fontWeight': 'bold', 'color': colors['dark']}),
                dcc.RadioItems(
                    id='chart-type-radio',
                    options=[
                        {'label': '  Evolução (Linha)', 'value': 'line'},
                        {'label': '  Distribuição (Treemap)', 'value': 'treemap'}
                    ],
                    value='treemap', # Inicia com o Treemap conforme pedido
                    inline=True,
                    style={'paddingTop': '8px'},
                    inputStyle={"marginRight": "5px"},
                    labelStyle={"marginRight": "15px"}
                ),
            ]),
            html.Div(style={'width': '300px'}, children=[
                html.Label("Selecione a Métrica:", style={'fontWeight': 'bold', 'color': colors['dark']}),
                dcc.Dropdown(
                    id='metric-dropdown',
                    options=[
                        {'label': 'Investimento (Milhões R$)', 'value': 'Investimento (Milhões R$)'},
                        {'label': 'Número de Beneficiários', 'value': 'Número de Beneficiários'},
                        {'label': 'Projetos Realizados', 'value': 'Projetos Realizados'}
                    ],
                    value='Investimento (Milhões R$)', # Métrica padrão
                    clearable=False,
                    style={'backgroundColor': colors['light'], 'borderColor': colors['unity2']}
                ),
            ]),
        ]),
    ]),

    html.Div(style={'padding': '20px', 'margin': '0 20px 20px 20px', 'backgroundColor': colors['light'], 'borderRadius': '8px', 'border': f'1px solid {colors["unity2"]}'}, children=[
        dcc.Graph(id='main-dashboard-graph')
    ]),

    html.Div(style={'backgroundColor': colors['unity1'], 'padding': '15px', 'textAlign': 'center', 'color': colors['light'], 'fontSize': '0.8em', 'marginTop': '20px'}, children=[
        html.P("Dashboard desenvolvido para o Projeto de Inovação - Unity+ © 2025")
    ])
])

# --- 4. Implementar Callbacks ---
@app.callback(
    Output('main-dashboard-graph', 'figure'),
    [Input('community-dropdown', 'value'),
     Input('data-type-dropdown', 'value'),
     Input('date-picker-range', 'start_date'),
     Input('date-picker-range', 'end_date'),
     Input('chart-type-radio', 'value'),
     Input('metric-dropdown', 'value')]
)
def update_graph(selected_community, selected_data_type, start_date, end_date, chart_type, selected_metric):
    filtered_df = df[
        (df["Data"] >= start_date) &
        (df["Data"] <= end_date)
    ].copy() # Usar .copy() para evitar SettingWithCopyWarning

    # Filtrar por comunidade se não for 'Todas as Comunidades'
    if selected_community != 'Todas as Comunidades':
        filtered_df = filtered_df[filtered_df["Comunidade"] == selected_community]

    # Filtrar por tipo de dado se não for 'Todas as Áreas'
    if selected_data_type != 'Todas as Áreas':
        filtered_df = filtered_df[filtered_df["Área de Atividade"] == selected_data_type]

    fig = {} # Inicializa a figura vazia

    if chart_type == 'treemap':
        # Para treemap, agrupar e somar os valores
        if selected_community == 'Todas as Comunidades' and selected_data_type == 'Todas as Áreas':
            # Caso inicial: todas as comunidades, todas as áreas
            # Hierarquia: Comunidade -> Área de Atividade
            grouped_df = filtered_df.groupby(['Comunidade', 'Área de Atividade'])[selected_metric].sum().reset_index()
            path_sequence = ['Comunidade', 'Área de Atividade']
            title = f"Distribuição de {selected_metric} por Comunidade e Área de Atividade (Total)"
        elif selected_community != 'Todas as Comunidades' and selected_data_type == 'Todas as Áreas':
            # Uma comunidade específica, todas as áreas
            grouped_df = filtered_df.groupby(['Área de Atividade'])[selected_metric].sum().reset_index()
            path_sequence = ['Área de Atividade']
            title = f"Distribuição de {selected_metric} por Área de Atividade na {selected_community}"
        elif selected_community == 'Todas as Comunidades' and selected_data_type != 'Todas as Áreas':
            # Todas as comunidades, uma área específica
            grouped_df = filtered_df.groupby(['Comunidade'])[selected_metric].sum().reset_index()
            path_sequence = ['Comunidade']
            title = f"Distribuição de {selected_metric} por Comunidade na Área de {selected_data_type}"
        else: # Uma comunidade específica, uma área específica (treemap não faz sentido aqui, mas para consistência)
              # Neste caso, um treemap de um item só seria redundante. Poderíamos mostrar um KPI.
              # Mas para fins de demonstração, ele criará um treemap com um único bloco.
            grouped_df = filtered_df.groupby(['Comunidade', 'Área de Atividade'])[selected_metric].sum().reset_index()
            path_sequence = ['Comunidade', 'Área de Atividade']
            title = f"Total de {selected_metric} para {selected_data_type} na {selected_community}"


        if grouped_df.empty:
            fig = {
                'data': [],
                'layout': {
                    'title': 'Não há dados para esta seleção.',
                    'height': 500,
                    'xaxis': {'visible': False},
                    'yaxis': {'visible': False}
                }
            }
            return fig

        fig = px.treemap(
            grouped_df,
            path=path_sequence,
            values=selected_metric,
            title=title,
            color_continuous_scale=[colors['unity5'], colors['unity2'], colors['unity4']], # Escala de cores do seu CSS
            color_continuous_midpoint=grouped_df[selected_metric].mean()
        )
        fig.update_layout(margin = dict(t=50, l=25, r=25, b=25)) # Ajuste de margem
        fig.data[0].textinfo = 'label+value+percent entry' # Mostrar rótulo, valor e porcentagem

    elif chart_type == 'line':
        # Gráfico de linha para evolução temporal (RF-35 e RF-36)
        if selected_community == 'Todas as Comunidades' or selected_data_type == 'Todas as Áreas':
            # Se 'Todas as Comunidades' ou 'Todas as Áreas', não faz sentido linha para um único indicador
            # Podemos mostrar a soma total ou alertar o usuário.
            # Por simplicidade, vou somar para ter uma linha única para o total
            summed_df = filtered_df.groupby('Data')[selected_metric].sum().reset_index()
            fig = px.line(
                summed_df,
                x="Data",
                y=selected_metric,
                title=f"Evolução Total de {selected_metric} ({selected_community} - {selected_data_type})",
                labels={"Data": "Data", selected_metric: f"{selected_metric}"},
                markers=True,
                color_discrete_sequence=[colors['unity3']] # Cor da linha
            )
        else:
            # Caso de uma comunidade e uma área específica
            fig = px.line(
                filtered_df,
                x="Data",
                y=selected_metric,
                title=f"Evolução de {selected_metric} na {selected_community} - Área: {selected_data_type}",
                labels={"Data": "Data", selected_metric: f"{selected_metric}"},
                markers=True,
                color_discrete_sequence=[colors['unity2']] # Cor da linha
            )

    fig.update_layout(
        xaxis_title="Data",
        yaxis_title=selected_metric,
        hovermode="x unified",
        template="plotly_white", # Fundo limpo
        plot_bgcolor=colors['light'], # Fundo do gráfico
        paper_bgcolor=colors['light'], # Fundo do papel
        font_color=colors['dark'], # Cor da fonte
        title_font_color=colors['unity1'] # Cor do título
    )

    return fig

# --- Executar a Aplicação ---
if __name__ == '__main__':
    # Para rodar este script:
    # 1. Salve o código como um arquivo .py (ex: dashboard_unityplus.py)
    # 2. No terminal, navegue até a pasta onde salvou o arquivo.
    # 3. Execute: python dashboard_unityplus.py
    # 4. Abra seu navegador e vá para http://127.0.0.1:8050/
    print(f"Iniciando o dashboard em http://127.0.0.1:8050/")
    app.run(debug=True) # Corrigido: app.run_server para app.run