"use client";

import { useMemo, useState } from "react";

type Member = {
  name: string;
  short: string;
  initials: string;
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
  { name: "Yessenia", short: "Yessenia", initials: "YG", color: "violet", hex: "#7657d5" },
  { name: "Madisson", short: "Madisson", initials: "MD", color: "blue", hex: "#3f7fd3" },
  { name: "Manuel Melara", short: "Manuel", initials: "MM", color: "teal", hex: "#2f998e" },
  { name: "Edwin Ayala", short: "Edwin", initials: "EA", color: "orange", hex: "#df7a3e" },
];

const requests: PtoRequest[] = [
  { id: "yes-dec28-31", member: "Yessenia", start: "2026-12-28", end: "2026-12-31", hours: 32, dailyHours: 8 },
  { id: "mad-dec14", member: "Madisson", start: "2026-12-14", end: "2026-12-14", hours: 8, dailyHours: 8 },
  { id: "mad-dec30-31", member: "Madisson", start: "2026-12-30", end: "2026-12-31", hours: 16, dailyHours: 8 },
  { id: "man-dec23", member: "Manuel Melara", start: "2026-12-23", end: "2026-12-23", hours: 8, dailyHours: 8 },
  { id: "man-jan04", member: "Manuel Melara", start: "2027-01-04", end: "2027-01-04", hours: 8, dailyHours: 8 },
  { id: "edw-dec21-23", member: "Edwin Ayala", start: "2026-12-21", end: "2026-12-23", hours: 24, dailyHours: 8 },
  { id: "edw-jan04", member: "Edwin Ayala", start: "2027-01-04", end: "2027-01-04", hours: 8, dailyHours: 8 },
];

const calendarMonths = [
  { year: 2026, month: 11, label: "December" },
  { year: 2027, month: 0, label: "January" },
];

const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

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
    month: "long",
    day: "numeric",
    ...(includeYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  });
}

function formatRange(request: PtoRequest) {
  const start = new Date(`${request.start}T00:00:00Z`);
  const end = new Date(`${request.end}T00:00:00Z`);
  const month = start.toLocaleDateString("en-US", { month: "long", timeZone: "UTC" });
  const year = start.getUTCFullYear() === 2027 ? ", 2027" : "";
  if (request.start === request.end) return `${month} ${start.getUTCDate()}${year}`;
  return `${month} ${start.getUTCDate()}–${end.getUTCDate()}${year}`;
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState("2026-12-23");

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
  const totalPtoDays = requests.reduce((sum, request) => sum + expandDates(request.start, request.end).length, 0);
  const totalHours = requests.reduce((sum, request) => sum + request.hours, 0);
  const employeePlans = members.map((member) => {
    const memberRequests = requests.filter((request) => request.member === member.name);
    const days = memberRequests.reduce((sum, request) => sum + expandDates(request.start, request.end).length, 0);
    const hours = memberRequests.reduce((sum, request) => sum + request.hours, 0);
    return { member, requests: memberRequests, days, hours };
  });

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="PTO Plan home">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>PTO Plan</span>
        </a>
        <div className="top-actions">
          <span className="year-chip">December 2026 — January 2027</span>
          <button className="print-button" type="button" onClick={() => window.print()}>Print / save PDF</button>
        </div>
      </header>

      <div className="dashboard" id="top">
        <section className="hero compact-hero">
          <div>
            <p className="eyebrow">2026 Team PTO Planner</p>
            <h1>December &amp; January<br /><span>PTO plan.</span></h1>
            <p className="hero-copy">Please review the proposed PTO dates below and let us know if you approve.</p>
          </div>
          <div className="hero-note">
            <span className="note-label">Planning window</span>
            <strong>December 2026 — January 2027</strong>
          </div>
        </section>

        <section className="metric-grid summary-grid" aria-label="PTO plan totals">
          <article className="metric-card metric-primary"><p>PTO days</p><strong>{totalPtoDays}</strong><span>across the four employees listed below</span></article>
          <article className="metric-card"><p>PTO hours</p><strong>{totalHours}</strong><span>based on 8-hour days</span></article>
        </section>

        <section className="section-block" aria-label="Employee PTO schedule">
          <div className="section-heading">
            <div><p className="eyebrow">Proposed schedule</p><h2>Days by employee</h2></div>
            <p className="section-note">Please review the dates and let us know if you approve.</p>
          </div>
          <div className="request-ledger schedule-breakdown">
            {employeePlans.map(({ member, requests: memberRequests, days, hours }) => (
              <article className={`request-card ${member.color}`} key={member.name}>
                <div className="request-card-head">
                  <span className="avatar">{member.initials}</span>
                  <div><h3>{member.name}</h3><p>{days} PTO days · {hours} hours</p></div>
                </div>
                <ul>
                  {memberRequests.map((request) => (
                    <li key={request.id}>{formatRange(request)} ({expandDates(request.start, request.end).length} {expandDates(request.start, request.end).length === 1 ? "day" : "days"})</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="calendar-section" id="calendar">
          <div className="section-heading calendar-title-row">
            <div><p className="eyebrow">Calendar</p><h2>Listed PTO dates</h2></div>
            <div className="calendar-legend employee-legend" aria-label="Employees">
              {members.map((member) => <span key={member.name}><i style={{ background: member.hex }} />{member.short}</span>)}
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
                      const entries = daySchedule.find(([date]) => date === key)?.[1] ?? [];
                      const isSelected = selectedDate === key;
                      const title = [formatDate(key, key.startsWith("2027")), ...entries.map((entry) => memberFor(entry.member).short)].join(" · ");
                      return (
                        <button
                          className={`mini-day ${entries.length ? "has-pto" : ""} ${isSelected ? "selected-day" : ""}`}
                          key={key}
                          type="button"
                          title={title}
                          onClick={() => setSelectedDate(key)}
                          aria-label={title}
                        >
                          <span className="mini-day-number">{day}</span>
                          {entries.length > 0 && <span className="member-dots" aria-hidden="true">{entries.map((entry) => <i key={entry.id} style={{ background: memberFor(entry.member).hex }} />)}</span>}
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
                  <div className="selected-people">
                    {selectedEntries.map((entry) => {
                      const person = memberFor(entry.member);
                      return <div className={`selected-person ${person.color}`} key={entry.id}><span className="person-swatch" /><b>{person.name}</b><span>{entry.dailyHours} hours</span></div>;
                    })}
                  </div>
                ) : <p className="empty-detail">No PTO is listed for this date.</p>}
                <p className="detail-tip">Select a calendar date to see the employees listed for that day.</p>
              </aside>
            </div>
          </div>
        </section>
      </div>

      <footer><span>PTO Plan</span><span>December 2026 — January 2027</span></footer>
    </main>
  );
}

