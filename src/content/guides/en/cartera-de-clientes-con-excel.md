---
order: 3
url_slug: client-portfolio-with-excel
topic: Accountants
product: plataforma-contable
title: How to organize your client portfolio with Excel
seo_title: How to organize an accounting firm’s client portfolio in Excel
meta_description: A template and a method to track an accounting firm’s clients, pending documents and deadlines in Excel, month after month.
summary: One row per client, fixed columns for what you ask for every month and simple formulas that flag what is late. Month-end then stops depending on memory.
updated: 2026-11-17
---

## One row per client

The most common mistake is spreading the information across several sheets or workbooks. Start with a single table where each row is a client and each column is something that repeats every month:

| Column | What it is for |
| --- | --- |
| Client | Name or company name |
| ID | Personal or company ID number |
| Regime | The tax regime the client files under |
| Obligations this month | What has to be filed in the period |
| Documents | Received, incomplete or pending |
| Due date | The nearest deadline |
| Status | Up to date, pending or late |

Turn the range into a **table** (Insert → Table): filters and formulas extend on their own when you add clients.

## Lists so nobody types it differently

In the Regime, Documents and Status columns use **Data Validation → List**. That way nobody writes "pending", "pend." and "missing" for the same thing, and the filters work.

## Formulas that flag what is late

These formulas also work in Excel 2019, with no new functions:

- Days left until the deadline: `=[@[Due date]]-TODAY()`
- Automatic status: `=IF([@Documents]="Received","Up to date",IF([@[Due date]]<TODAY(),"Late","Pending"))`
- How many clients are late: `=COUNTIF(Table1[Status],"Late")`

With **Conditional Formatting**, paint late rows red and those due in less than five days yellow.

## Month-end close

1. Duplicate last month’s sheet and rename it for the new month.
2. Set every document to "Pending".
3. Update the period’s due dates.
4. Filter by "Pending" every few days and write only to whoever is missing something.

## When the sheet is not enough

Excel works well until your clients send documents through several channels or more than one person updates the same file. That is when a portal where each client uploads their own documents helps, along with a portfolio imported straight from this same sheet.
