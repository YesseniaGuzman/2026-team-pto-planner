"use client";

import { useEffect, useMemo, useState } from "react";

type Status = "pending" | "approved" | "denied";

type Member = {
  name: string;
  short: string;
  initials: string;
  accrued: number | null;
  planned: number;
  color: string;
  hex: string;
};

type PtoRequest = {
  id: string;
  member: string;
  start: string;
  end: string;
  hours: number;
  dailyHours: number;
};

const members: Member[] = [
  { name: "Yessenia", short: "Yessenia", initials: "YG", accrued: 126, planned: 92, color: "violet", hex: "#7657d5" },
  { name: "Madisson", short: "Madisson", initials: "MD", accrued: 120, planned: 56, color: "blue", hex: "#3f7fd3" },
  { name: "Manuel Melara", short: "Manuel", initials: "MM", accrued: 116, planned: 44, color: "teal", hex: "#2f998e" },
  { name: "Edwin Ayala", short: "Edwin", initials: "EA", accrued: 72, planned: 32, color: "orange", hex: "#df7a3e" },
  { name: "Keha Norman", short: "Keha", initials: "KN", accrued: null, planned: 40, color: "green", hex: "#4f9864" },
  { name: "Kindra Williams", short: "Kindra", initials: "KW", accrued: null, planned: 96, color: "navy", hex: "#215a7a" },
];

const requests: PtoRequest[] = [
  { id: "yes-sep", member: "Yessenia", start: "2026-09-08", end: "2026-09-11", hours: 32, dailyHours: 8 },
  { id: "yes-oct", member: "Yessenia", start: "2026-10-08", end: "2026-10-09", hours: 16, dailyHours: 8 },
  { id: "yes-nov24", member: "Yessenia", start: "2026-11-24", end: "2026-11-24", hours: 8, dailyHours: 8 },
  { id: "yes-nov25", member: "Yessenia", start: "2026-11-25", end: "2026-11-25", hours: 4, dailyHours: 4 },
  { id: "yes-dec", member: "Yessenia", start: "2026-12-28", end: "2026-12-31", hours: 32, dailyHours: 8 },
  { id: "mad-oct", member: "Madisson", start: "2026-10-15", end: "2026-10-16", hours: 16, dailyHours: 8 },
  { id: "mad-nov", member: "Madisson", start: "2026-11-30", end: "2026-11-30", hours: 8, dailyHours: 8 },
  { id: "mad-dec1", member: "Madisson", start: "2026-12-01", end: "2026-12-01", hours: 8, dailyHours: 8 },
  { id: "mad-dec14", member: "Madisson", start: "2026-12-14", end: "2026-12-14", hours: 8, dailyHours: 8 },
  { id: "mad-dec30-31", member: "Madisson", start: "2026-12-30", end: "2026-12-31", hours: 16, dailyHours: 8 },
  { id: "man-sep", member: "Manuel Melara", start: "2026-09-08", end: "2026-09-08", hours: 8, dailyHours: 8 },
  { id: "man-nov", member: "Manuel Melara", start: "2026-11-23", end: "2026-11-24", hours: 16, dailyHours: 8 },
  { id: "man-nov25", member: "Manuel Melara", start: "2026-11-25", end: "2026-11-25", hours: 4, dailyHours: 4 },
  { id: "man-dec23", member: "Manuel Melara", start: "2026-12-23", end: "2026-12-23", hours: 8, dailyHours: 8 },
  { id: "man-jan04", member: "Manuel Melara", start: "2027-01-04", end: "2027-01-04", hours: 8, dailyHours: 8 },
  { id: "edw-dec", member: "Edwin Ayala", start: "2026-12-21", end: "2026-12-23", hours: 24, dailyHours: 8 },
  { id: "edw-jan", member: "Edwin Ayala", start: "2027-01-04", end: "2027-01-04", hours: 8, dailyHours: 8 },
  { id: "keh-dec", member: "Keha Norman", start: "2026-12-14", end: "2026-12-18", hours: 40, dailyHours: 8 },
  { id: "kin-aug25", member: "Kindra Williams", start: "2026-08-25", end: "2026-08-25", hours: 8, dailyHours: 8 },
  { id: "kin-sep03", member: "Kindra Williams", start: "2026-09-03", end: "2026-09-03", hours: 8, dailyHours: 8 },
  { id: "kin-sep04", member: "Kindra Williams", start: "2026-09-04", end: "2026-09-04", hours: 8, dailyHours: 8 },
  { id: "kin-sep29", member: "Kindra Williams", start: "2026-09-29", end: "2026-09-29", hours: 8, dailyHours: 8 },
  { id: "kin-oct06", member: "Kindra Williams", start: "2026-10-06", end: "2026-10-06", hours: 8, dailyHours: 8 },
  { id: "kin-oct07", member: "Kindra Williams", start: "2026-10-07", end: "2026-10-07", hours: 8, dailyHours: 8 },
  { id: "kin-oct12", member: "Kindra Williams", start: "2026-10-12", end: "2026-10-12", hours: 8, dailyHours: 8 },
  { id: "kin-nov19", member: "Kindra Williams", start: "2026-11-19", end: "2026-11-19", hours: 8, dailyHours: 8 },
  { id: "kin-nov20", member: "Kindra Williams", start: "2026-11-20", end: "2026-11-20", hours: 8, dailyHours: 8 },
  { id: "kin-nov30", member: "Kindra Williams", start: "2026-11-30", end: "2026-11-30", hours: 8, dailyHours: 8 },
  { id: "kin-dec08", member: "Kindra Williams", start: "2026-12-08", end: "2026-12-08", hours: 8, dailyHours: 8 },
  { id: "kin-dec15", member: "Kindra Williams", start: "2026-12-15", end: "2026-12-15", hours: 8, dailyHours: 8 },
];

const holidays = [
  { date: "2026-12-24", label: "Christmas Eve", short: "Christmas Eve", type: "full" },
  { date: "2026-12-25", label: "Christmas Day", short: "Christmas Day", type: "full" },
];

const calendarMonths = [
  { year: 2026, month: 11, label: "December" },
  { year: 2027, month: 0, label: "January" },
];

const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
const storageKey = "pto-plan-2026-request-statuses-reset";
const legacyStorageKey = "pto-plan-2026-request-statuses";

function memberFor(name: string) {
  return members.find((member) => member.name === name)!;
}

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function monthCells(year: number, month: number) {
  const leading = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = [...Array(leading).fill(null), ...Array.from({ length: days }, (_, index) => index + 1)];
  return [...cells, ...Array((7 - (cells.length % 7)) % 7).fill(null)];
}

function expandDates(start: string, end: string) {
  const output: string[] = [];
  const cursor = new Date(`${start}T00:00:00Z`);
  const finish = new Date(`${end}T00:00:00Z`);
  while (cursor <= finish) {
    output.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return output;
}

function formatDate(date: string, includeYear = false) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(includeYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  });
}

function formatRange(request: PtoRequest) {
  if (request.start === request.end) return formatDate(request.start, request.start.startsWith("2027"));
  const start = new Date(`${request.start}T00:00:00Z`);
  const end = new Date(`${request.end}T00:00:00Z`);
  const sameMonth = start.getUTCMonth() === end.getUTCMonth() && start.getUTCFullYear() === end.getUTCFullYear();
  if (sameMonth) {
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}–${end.getUTCDate()}${start.getUTCFullYear() === 2027 ? ", 2027" : ""}`;
  }
  return `${formatDate(request.start)}–${formatDate(request.end, request.end.startsWith("2027"))}`;
}

export default function Home() {
  const [activeMember, setActiveMember] = useState("All team");
  const [selectedDate, setSelectedDate] = useState("2026-12-23");
  const [statuses, setStatuses] = useState<Record<string, Status>>({});

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      window.localStorage.removeItem(legacyStorageKey);
      const saved = window.localStorage.getItem(storageKey);
      if (saved) timer = setTimeout(() => setStatuses(JSON.parse(saved)), 0);
    } catch {
      // The dashboard still works when browser storage is unavailable.
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const toggleRequestStatus = (id: string, status: Exclude<Status, "pending">) => {
    setStatuses((current) => {
      const next = { ...current };
      if (current[id] === status) delete next[id];
      else next[id] = status;
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Keep the current-session decision even if browser storage is unavailable.
      }
      return next;
    });
  };

  const daySchedule = useMemo(() => {
    const byDate = new Map<string, PtoRequest[]>();
    requests.forEach((request) => {
      expandDates(request.start, request.end).forEach((date) => {
        byDate.set(date, [...(byDate.get(date) ?? []), request]);
      });
    });
    return [...byDate.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, []);

  const selectedEntries = daySchedule.find(([date]) => date === selectedDate)?.[1] ?? [];
  const selectedHoliday = holidays.find((holiday) => holiday.date === selectedDate);
  const accrued = members.reduce((sum, member) => sum + (member.accrued ?? 0), 0);
  const reportedBalances = members.filter((member) => member.accrued !== null).length;
  const planned = requests.reduce((sum, request) => sum + request.hours, 0);
  const pendingCount = requests.filter((request) => (statuses[request.id] ?? "pending") === "pending").length;
  const overlapDays = daySchedule.filter(([, entries]) => entries.length >= 2);
  const peakAway = Math.max(0, ...overlapDays.map(([, entries]) => entries.length));
  const peakDates = overlapDays.filter(([, entries]) => entries.length === peakAway).map(([date]) => date);
  const peakSummary = peakDates.length === 1
    ? `${formatDate(peakDates[0], peakDates[0].startsWith("2027"))} is the only date with ${peakAway} people away. Every other overlap has fewer people away.`
    : `${peakDates.length} dates share the peak of ${peakAway} people away.`;

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="PTO Plan home">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>PTO Plan</span>
        </a>
        <nav className="top-actions" aria-label="Page actions">
          <a className="header-link" href="#approvals">Approvals</a>
          <button className="print-button" type="button" onClick={() => window.print()}>Print / save PDF</button>
        </nav>
      </header>

      <div className="dashboard" id="top">
        <section className="hero compact-hero">
          <div>
            <p className="eyebrow">People Operations · 2026 planning cycle</p>
            <h1>Team PTO,<br /><span>clearly coordinated.</span></h1>
            <p className="hero-copy">Review every requested day and compare team coverage at a glance. Official PTO decisions are made by supervisors Claudia and Kindra.</p>
          </div>
          <div className="hero-note">
            <span className="note-label">Planning window</span>
            <strong>December 2026 — January 2027</strong>
            <p>January 4 requests are treated as January 4, 2027.</p>
          </div>
        </section>

        <section className="metric-grid" aria-label="Team PTO totals">
          <article className="metric-card metric-primary"><p>Projected hours</p><strong>{accrued}</strong><span>reported for {reportedBalances} of {members.length} team members</span></article>
          <article className="metric-card"><p>Requested PTO</p><strong>{planned}</strong><span>hours across {requests.length} requests</span></article>
          <article className="metric-card"><p>Approval owners</p><strong>2</strong><span>Claudia and Kindra · supervisors</span></article>
          <article className="metric-card metric-alert"><p>Peak overlap</p><strong>{peakAway}</strong><span>{peakDates.length === 1 ? `people away on ${formatDate(peakDates[0], peakDates[0].startsWith("2027"))}` : `people away across ${peakDates.length} dates`}</span></article>
        </section>

        <section className="supervisor-notice" aria-label="PTO approval process">
          <span className="supervisor-notice-icon" aria-hidden="true">✓</span>
          <div>
            <p className="eyebrow">Approval process</p>
            <h2>Supervisor decisions stay with Claudia and Kindra.</h2>
            <p>The controls below are for Claudia and Kindra. Select Approved or Denied; select the same button again to return the request to Pending.</p>
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div><p className="eyebrow">Color key & balances</p><h2>One color for each person</h2></div>
            <p className="section-note">Select a person to filter the calendar and approval list</p>
          </div>
          <div className="member-grid">
            {members.map((member) => {
              const remaining = member.accrued === null ? null : member.accrued - member.planned;
              const usage = member.accrued && member.accrued > 0 ? Math.round((member.planned / member.accrued) * 100) : 0;
              return (
                <button
                  className={`member-card ${member.color} ${activeMember === member.name ? "selected" : ""}`}
                  key={member.name}
                  type="button"
                  onClick={() => setActiveMember(activeMember === member.name ? "All team" : member.name)}
                  aria-pressed={activeMember === member.name}
                >
                  <span className="member-head"><span className="avatar">{member.initials}</span><span><b>{member.name}</b><small>{member.accrued === null ? "Balance not provided" : `${member.accrued}h projected`}</small></span></span>
                  <span className="bar"><span style={{ width: `${usage}%` }} /></span>
                  <span className="member-stats"><span><small>Requested</small><b>{member.planned}h</b></span><span><small>Remaining</small><b>{remaining === null ? "—" : `${remaining}h`}</b></span></span>
                </button>
              );
            })}
          </div>
          {activeMember !== "All team" && <button className="clear-filter" type="button" onClick={() => setActiveMember("All team")}>Clear {activeMember} filter ×</button>}
        </section>

        <section className="calendar-section" id="calendar">
          <div className="section-heading calendar-title-row">
            <div><p className="eyebrow">Calendar overview</p><h2>All requested days at a glance</h2></div>
            <div className="calendar-legend" aria-label="Calendar legend">
              <span><i className="holiday-key" /> Company holiday</span>
              <span><i className="overlap-key" /> Overlap: 2+ away</span>
            </div>
          </div>

          <div className="year-calendar-shell">
            <div className="year-calendar-grid">
              {calendarMonths.map((month) => (
                <article className="mini-month" key={`${month.year}-${month.month}`}>
                  <div className="mini-month-head"><h3>{month.label}</h3><span>{month.year}</span></div>
                  <div className="mini-weekdays" aria-hidden="true">{weekdays.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
                  <div className="mini-days" aria-label={`${month.label} ${month.year}`}>
                    {monthCells(month.year, month.month).map((day, index) => {
                      if (!day) return <span className="mini-day empty" key={`empty-${index}`} />;
                      const key = dateKey(month.year, month.month, day);
                      const allEntries = daySchedule.find(([date]) => date === key)?.[1] ?? [];
                      const visibleEntries = allEntries.filter((entry) => activeMember === "All team" || entry.member === activeMember);
                      const holiday = holidays.find((item) => item.date === key);
                      const isOverlap = allEntries.length >= 2;
                      const isSelected = selectedDate === key;
                      const titleParts = [
                        formatDate(key, key.startsWith("2027")),
                        ...allEntries.map((entry) => `${memberFor(entry.member).short} ${entry.dailyHours}h`),
                        ...(holiday ? [holiday.label] : []),
                      ];
                      return (
                        <button
                          className={`mini-day ${visibleEntries.length ? "has-pto" : ""} ${holiday ? "is-holiday" : ""} ${isOverlap ? "is-overlap" : ""} ${isSelected ? "selected-day" : ""}`}
                          key={key}
                          type="button"
                          title={titleParts.join(" · ")}
                          onClick={() => setSelectedDate(key)}
                          aria-label={titleParts.join(", ")}
                        >
                          <span className="mini-day-number">{day}</span>
                          {visibleEntries.length > 0 && <span className="member-dots" aria-hidden="true">{visibleEntries.map((entry) => <i key={entry.id} style={{ background: memberFor(entry.member).hex }} />)}</span>}
                          {isOverlap && <b className="overlap-count" aria-hidden="true">{allEntries.length}</b>}
                        </button>
                      );
                    })}
                  </div>
                </article>
              ))}
              <aside className="calendar-detail" aria-live="polite">
                <p className="eyebrow">Selected date</p>
                <h3>{formatDate(selectedDate, true)}</h3>
                {selectedEntries.length ? (
                  <>
                    <div className="selected-people">
                      {selectedEntries.map((entry) => {
                        const person = memberFor(entry.member);
                        return <div className={`selected-person ${person.color}`} key={entry.id}><span className="person-swatch" /><b>{person.name}</b><span>{entry.dailyHours}h</span></div>;
                      })}
                    </div>
                    {selectedEntries.length >= 2 && <div className={`detail-alert ${selectedEntries.length >= 3 ? "critical" : ""}`}><b>{selectedEntries.length} people away</b><span>{selectedEntries.length >= 3 ? "Highest coverage risk" : "Overlap day"}</span></div>}
                  </>
                ) : <p className="empty-detail">No PTO is listed for this date.</p>}
                {selectedHoliday && <div className="selected-holiday"><b>{selectedHoliday.label}</b><span>{selectedHoliday.type === "partial" ? "Partial-day closure" : "Company holiday"}</span></div>}
                <p className="detail-tip">Select any date in the calendar to see its details.</p>
              </aside>
            </div>
          </div>
        </section>

        <section className="approval-section" id="approvals">
          <div className="section-heading">
            <div><p className="eyebrow">Supervisor review</p><h2>Approve or deny each request</h2></div>
            <div className="status-summary">
              <span>{requests.filter((item) => statuses[item.id] === "approved").length} approved</span>
              <span>{requests.filter((item) => statuses[item.id] === "denied").length} denied</span>
              <span>{pendingCount} pending</span>
            </div>
          </div>
          <p className="browser-note">The two accidental approvals have been cleared. Decisions save automatically in this browser. Click a selected button again to unselect it.</p>
          <div className="approval-list">
            {requests.filter((request) => activeMember === "All team" || request.member === activeMember).map((request) => {
              const person = memberFor(request.member);
              const status = statuses[request.id] ?? "pending";
              return (
                <article className={`approval-row ${person.color}`} key={request.id}>
                  <div className="approval-person"><span className="avatar">{person.initials}</span><span><b>{person.name}</b><small>{formatRange(request)}</small></span></div>
                  <div className="request-days"><b>{expandDates(request.start, request.end).map((date) => formatDate(date)).join(" · ")}</b><span>{request.hours} hours total{request.dailyHours === 4 ? " · Half day" : ""}</span></div>
                  <span className={`status-pill ${status}`}>{status}</span>
                  <div className="decision-buttons" aria-label={`Decision for ${person.name}, ${formatRange(request)}`}>
                    <button type="button" className={status === "approved" ? "chosen approve" : "approve"} onClick={() => toggleRequestStatus(request.id, "approved")} aria-pressed={status === "approved"}>✓ Approved</button>
                    <button type="button" className={status === "denied" ? "chosen deny" : "deny"} onClick={() => toggleRequestStatus(request.id, "denied")} aria-pressed={status === "denied"}>× Denied</button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="coverage-panel revised-coverage">
          <div className="coverage-copy">
            <p className="eyebrow">Coverage watch</p>
            <h2>{overlapDays.length} overlap days</h2>
            <p>{peakSummary}</p>
          </div>
          <div className="date-list">
            {overlapDays.map(([date, entries]) => (
              <button className="date-row overlap-row" type="button" key={date} onClick={() => { setSelectedDate(date); document.getElementById("calendar")?.scrollIntoView({ behavior: "smooth" }); }}>
                <span className={`risk-dot ${entries.length >= 3 ? "high" : ""}`} aria-hidden="true" />
                <strong>{formatDate(date, date.startsWith("2027"))}</strong>
                <span>{entries.map((entry) => memberFor(entry.member).short).join(" + ")}</span>
                <b>{entries.length} away</b>
              </button>
            ))}
          </div>
        </section>

        <section className="holiday-strip">
          <div><p className="eyebrow">Company calendar</p><h2>December 2026 holidays</h2></div>
          <div className="holiday-strip-list">
            {holidays.map((holiday) => <div className="holiday-strip-item" key={holiday.date}><span>{formatDate(holiday.date)}</span><b>{holiday.label}</b>{holiday.type === "partial" && <small>Partial closure</small>}</div>)}
          </div>
        </section>

        <div className="assumption-note">
          <strong>Balance assumption</strong>
          <p>Balances subtract every listed request, including January 4, 2027, from the projected EOY hours supplied. Keha Norman and Kindra Williams do not have remaining balances calculated because their projected EOY hours were not provided. January 2027 is shown without a holiday overlay because the supplied company calendar ends December 31, 2026.</p>
        </div>
      </div>

      <footer><span>PTO Plan 2026</span><span>Calendar view · December 2026 — January 2027</span></footer>
    </main>
  );
}
