import { useEffect, useState } from "react";
import resumeUrl from "../resume.xml?url";

function Header({ name, title }) {
  return (
    <header className="header">
      <h1>{name}</h1>
      <h2>{title}</h2>
    </header>
  );
}

function ContactList({ contacts }) {
  return (
    <div className="contact-list">
      {contacts.map((c, i) => (
        <div key={i} className="contact">
          <strong>{c.type}:</strong> {c.value}
        </div>
      ))}
    </div>
  );
}

function ProfileSection({ profile }) {
  return (
    <section className="profile">
      <h3>Profile</h3>
      <ul>
        {profile.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </section>
  );
}

function SkillsSection({ skills }) {
  return (
    <section className="skills">
      <h3>Skills</h3>
      {skills.map((s) => (
        <div key={s.id} className="skill">
          <h4>{s.type}</h4>
          {s.mainDetail ? <div className="skill-main">{s.mainDetail}</div> : null}
          <ul>
            {s.values.map((v, idx) => (
              <li key={idx}>{v.text} {v.description ? `(${v.description})` : null}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

function WorkHistory({ work }) {
  return (
    <section className="work-history">
      <h3>Work History</h3>
      {work.map((c) => (
        <div key={c.id} className="company">
          <h4>
            {c.name} {c.position ? `— ${c.position}` : null}
          </h4>
          <div className="dates">{c.startDate} — {c.endDate}</div>
          {c.assignments.map((a) => (
            <div key={a.id} className="assignment">
              {a.name ? <strong>{a.name}</strong> : null}
              {a.description ? <p>{a.description}</p> : null}
              <div className="assignment-meta">
                {a.environment ? <div><strong>Environment:</strong> {a.environment}</div> : null}
                {a.tools ? <div><strong>Tools:</strong> {a.tools}</div> : null}
              </div>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

function Resume() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetch(resumeUrl)
      .then((r) => r.text())
      .then((text) => {
        try {
          const parsed = parseXML(text);
          if (mounted) setData(parsed);
        } catch (e) {
          if (mounted) setError(e.message || String(e));
        }
      })
      .catch((e) => {
        if (mounted) setError(e.message || String(e));
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (error) return <div className="resume-error">Error: {error}</div>;
  if (!data) return <div className="resume-loading">Loading resume…</div>;

  return (
    <section className="resume">
      <Header name={data.name} title={data.title} />
      <ContactList contacts={data.contacts} />
      <ProfileSection profile={data.profile} />
      <SkillsSection skills={data.skills} />
      <WorkHistory work={data.work} />
    </section>
  );
}

function parseXML(xmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "application/xml");
  const err = doc.querySelector("parsererror");
  if (err) throw new Error("Failed to parse XML");

  const root = doc.documentElement;
  const resume = {
    name: root.getAttribute("name") || "",
    title: root.getAttribute("title") || "",
    contacts: [],
    profile: [],
    skills: [],
    work: [],
  };

  resume.contacts = Array.from(doc.querySelectorAll("contact-list > contact")).map((c) => ({
    type: c.getAttribute("type") || "",
    value: c.getAttribute("value") || c.textContent.trim() || "",
  }));

  resume.profile = Array.from(doc.querySelectorAll("profile > entry")).map((e) => e.textContent.trim());

  resume.skills = Array.from(doc.querySelectorAll("skill-list > skill")).map((s) => ({
    id: s.getAttribute("id") || s.querySelector("type")?.textContent.trim() || Math.random().toString(36).slice(2),
    type: s.querySelector("type")?.textContent.trim() || "",
    mainDetail: s.querySelector("main-detail")?.textContent.trim() || null,
    values: Array.from(s.querySelectorAll("value")).map((v) => ({ description: v.getAttribute("description") || "", text: v.textContent.trim() })),
  }));

  resume.work = Array.from(doc.querySelectorAll("work-history > company")).map((c) => ({
    id: c.getAttribute("id") || Math.random().toString(36).slice(2),
    name: c.getAttribute("name") || "",
    url: c.getAttribute("url") || "",
    department: c.getAttribute("department") || "",
    position: c.getAttribute("position") || "",
    startDate: c.getAttribute("startDate") || "",
    endDate: c.getAttribute("endDate") || "",
    assignments: Array.from(c.querySelectorAll("assignment")).map((a) => ({
      id: a.getAttribute("id") || Math.random().toString(36).slice(2),
      name: a.getAttribute("name") || "",
      environment: a.querySelector("assignment-environment")?.textContent.trim() || "",
      tools: a.querySelector("assignment-tools")?.textContent.trim() || "",
      description: a.querySelector("assignment-description")?.textContent.trim() || "",
    })),
  }));

  return resume;
}

export default Resume;
