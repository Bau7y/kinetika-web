---
order: 3
url_slug: cartera-de-clientes-con-excel
topic: Contadores
product: plataforma-contable
title: Cómo organizar la cartera de clientes con Excel
seo_title: Cómo organizar la cartera de clientes de un despacho contable en Excel
meta_description: Una plantilla y un método para llevar la cartera de clientes, documentos pendientes y vencimientos de un despacho contable en Excel, mes a mes.
summary: Una fila por cliente, columnas fijas para lo que pedís cada mes y fórmulas simples que marcan lo atrasado. Con eso el cierre deja de depender de la memoria.
updated: 2026-11-17
---

## Una fila por cliente

El error más común es repartir la información en varias hojas o libros. Empezá con una sola tabla donde cada fila sea un cliente y cada columna un dato que se repite todos los meses:

| Columna | Para qué sirve |
| --- | --- |
| Cliente | Nombre o razón social |
| Identificación | Cédula física o jurídica |
| Régimen | El régimen en el que declara |
| Obligaciones del mes | Lo que hay que presentar en el periodo |
| Documentos | Recibidos, incompletos o pendientes |
| Fecha límite | El vencimiento más cercano |
| Estado | Al día, pendiente o atrasado |

Convertí el rango en **tabla** (Insertar → Tabla): los filtros y las fórmulas se extienden solos cuando agregás clientes.

## Listas para no escribir distinto cada vez

En las columnas Régimen, Documentos y Estado usá **Validación de datos → Lista**. Así nadie escribe "pendiente", "Pend." y "falta" para lo mismo, y los filtros funcionan.

## Fórmulas que marcan lo atrasado

Estas fórmulas funcionan también en Excel 2019, sin funciones nuevas:

- Días que faltan para el vencimiento: `=[@[Fecha límite]]-HOY()`
- Estado automático: `=SI([@Documentos]="Recibidos";"Al día";SI([@[Fecha límite]]<HOY();"Atrasado";"Pendiente"))`
- Cuántos clientes están atrasados: `=CONTAR.SI(Tabla1[Estado];"Atrasado")`

Con **Formato condicional** pintá en rojo las filas atrasadas y en amarillo las que vencen en menos de cinco días.

## El cierre de cada mes

1. Duplicá la hoja del mes anterior y renombrala con el mes nuevo.
2. Poné todos los documentos en "Pendientes".
3. Actualizá las fechas límite del periodo.
4. Filtrá por "Pendiente" cada pocos días y escribí solo a quien le falta algo.

## Cuando la hoja se queda corta

Excel funciona bien hasta que tus clientes tienen que mandarte documentos por varios canales o hay más de una persona actualizando el mismo archivo. Ahí sirve un portal donde cada cliente sube lo suyo y una cartera que se importa directo desde esta misma hoja.
