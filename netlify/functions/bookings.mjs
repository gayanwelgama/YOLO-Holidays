import { neon } from "@netlify/neon";

const sql = neon();

export default async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  try {
    // GET all or single
    if (req.method === "GET") {
      if (id) {
        const rows = await sql`SELECT * FROM bookings WHERE id = ${id}`;
        if (!rows.length) return Response.json({ error: "Not found" }, { status: 404 });
        return Response.json(dbToBooking(rows[0]));
      }
      const rows = await sql`SELECT * FROM bookings ORDER BY created_at DESC`;
      return Response.json(rows.map(dbToBooking));
    }

    // POST create
    if (req.method === "POST") {
      const b = await req.json();
      await sql`
        INSERT INTO bookings (
          id, invoice_id, name, mobile, pax, dest, airline, date,
          departure_date, return_date, total, advance, due, balance_due_date,
          full_paid, pay_note, dmc, dmc_advance, dmc_full,
          actual_ticket_cost, actual_dmc_advance_cost, actual_dmc_cost,
          actual_delivery_cost, actual_extra_cost, actual_extra_note,
          estimated_profit, tickets, dmc_advance_paid, dmc_full_paid,
          prepared, sent, checkin, arrival, departed, returned, cancelled,
          child_categories, merged_invoices, remarks, created_date, supplier_payments,
          group_tour_id, tour_package_id, tour, city_nights
        ) VALUES (
          ${b.id}, ${b.invoiceId||''}, ${b.name}, ${b.mobile||''},
          ${b.pax||1}, ${b.dest||''}, ${b.airline||''}, ${b.date||''},
          ${b.departureDate||''}, ${b.returnDate||''},
          ${b.total||0}, ${b.advance||0}, ${b.due||0}, ${b.balanceDueDate||''},
          ${b.fullPaid||''}, ${b.payNote||''},
          ${b.dmc||''}, ${b.dmcAdvance||''}, ${b.dmcFull||''},
          ${b.actualTicketCost||0}, ${b.actualDmcAdvanceCost||0}, ${b.actualDmcCost||0},
          ${b.actualDeliveryCost||0}, ${b.actualExtraCost||0}, ${b.actualExtraNote||''},
          ${b.estimatedProfit||0},
          ${b.tickets||false}, ${b.dmcAdvancePaid||false}, ${b.dmcFullPaid||false},
          ${b.prepared||false}, ${b.sent||false}, ${b.checkin||false},
          ${b.arrival||false}, ${b.departed||false}, ${b.returned||false},
          ${b.cancelled||false},
          ${JSON.stringify(b.childCategories||[])},
          ${JSON.stringify(b.mergedInvoices||[])},
          ${b.remarks||''}, ${b.createdDate||new Date().toISOString().split('T')[0]},
          ${JSON.stringify(b.supplierPayments||{})},
          ${b.groupTourId||''}, ${b.tourPackageId||''},
          ${b.tour||''}, ${JSON.stringify(b.cityNights||[])}
        )
      `;
      return Response.json({ ok: true, id: b.id }, { status: 201 });
    }

    // PUT update
    if (req.method === "PUT") {
      if (!id) return Response.json({ error: "id required" }, { status: 400 });
      const b = await req.json();
      await sql`
        UPDATE bookings SET
          invoice_id         = ${b.invoiceId||''},
          name               = ${b.name},
          mobile             = ${b.mobile||''},
          pax                = ${b.pax||1},
          dest               = ${b.dest||''},
          airline            = ${b.airline||''},
          date               = ${b.date||''},
          departure_date     = ${b.departureDate||''},
          return_date        = ${b.returnDate||''},
          total              = ${b.total||0},
          advance            = ${b.advance||0},
          due                = ${b.due||0},
          balance_due_date   = ${b.balanceDueDate||''},
          full_paid          = ${b.fullPaid||''},
          pay_note           = ${b.payNote||''},
          dmc                = ${b.dmc||''},
          dmc_advance        = ${b.dmcAdvance||''},
          dmc_full           = ${b.dmcFull||''},
          actual_ticket_cost       = ${b.actualTicketCost||0},
          actual_dmc_advance_cost  = ${b.actualDmcAdvanceCost||0},
          actual_dmc_cost          = ${b.actualDmcCost||0},
          actual_delivery_cost     = ${b.actualDeliveryCost||0},
          actual_extra_cost        = ${b.actualExtraCost||0},
          actual_extra_note        = ${b.actualExtraNote||''},
          estimated_profit   = ${b.estimatedProfit||0},
          tickets            = ${b.tickets||false},
          dmc_advance_paid   = ${b.dmcAdvancePaid||false},
          dmc_full_paid      = ${b.dmcFullPaid||false},
          prepared           = ${b.prepared||false},
          sent               = ${b.sent||false},
          checkin            = ${b.checkin||false},
          arrival            = ${b.arrival||false},
          departed           = ${b.departed||false},
          returned           = ${b.returned||false},
          cancelled          = ${b.cancelled||false},
          child_categories    = ${JSON.stringify(b.childCategories||[])},
          merged_invoices     = ${JSON.stringify(b.mergedInvoices||[])},
          remarks             = ${b.remarks||''},
          supplier_payments   = ${JSON.stringify(b.supplierPayments||{})},
          group_tour_id       = ${b.groupTourId||''},
          tour_package_id     = ${b.tourPackageId||''},
          tour                = ${b.tour||''},
          city_nights         = ${JSON.stringify(b.cityNights||[])}
        WHERE id = ${id}
      `;
      return Response.json({ ok: true });
    }

    // DELETE
    if (req.method === "DELETE") {
      if (!id) return Response.json({ error: "id required" }, { status: 400 });
      await sql`DELETE FROM bookings WHERE id = ${id}`;
      return Response.json({ ok: true });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });

  } catch (err) {
    console.error("bookings error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
};

function dbToBooking(r) {
  return {
    id: r.id,
    invoiceId: r.invoice_id,
    name: r.name,
    mobile: r.mobile,
    pax: r.pax,
    dest: r.dest,
    airline: r.airline,
    date: r.date,
    departureDate: r.departure_date,
    returnDate: r.return_date,
    total: r.total,
    advance: r.advance,
    due: r.due,
    balanceDueDate: r.balance_due_date,
    fullPaid: r.full_paid,
    payNote: r.pay_note,
    dmc: r.dmc,
    dmcAdvance: r.dmc_advance,
    dmcFull: r.dmc_full,
    actualTicketCost: r.actual_ticket_cost,
    actualDmcAdvanceCost: r.actual_dmc_advance_cost,
    actualDmcCost: r.actual_dmc_cost,
    actualDeliveryCost: r.actual_delivery_cost,
    actualExtraCost: r.actual_extra_cost,
    actualExtraNote: r.actual_extra_note,
    estimatedProfit: r.estimated_profit,
    tickets: r.tickets,
    dmcAdvancePaid: r.dmc_advance_paid,
    dmcFullPaid: r.dmc_full_paid,
    prepared: r.prepared,
    sent: r.sent,
    checkin: r.checkin,
    arrival: r.arrival,
    departed: r.departed,
    returned: r.returned,
    cancelled: r.cancelled,
    childCategories: r.child_categories || [],
    mergedInvoices: r.merged_invoices || [],
    remarks: r.remarks,
    createdDate: r.created_date,
    supplierPayments: r.supplier_payments || {},
    groupTourId: r.group_tour_id || '',
    tourPackageId: r.tour_package_id || '',
    tour: r.tour || '',
    cityNights: r.city_nights || [],
  };
}

export const config = { path: "/api/bookings" };
