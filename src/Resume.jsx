import { useEffect, useState } from "react";
import resumeUrl from "../resume.xml?url";

function Header({ name, title, contacts, email, domain }) {
  return (
    <header className="header">
      <h1 className="header-name">{name}</h1>
      <h2 className="header-title">{title}</h2>

      <div className="contact-info">
        <span className="contact-items">
          {contacts && contacts.map((c, i) => (
            <span key={i} className="contact-item">
              <b>{c.type}: </b>
              {c.url ? <a href={c.url} target="_blank" rel="noreferrer">{c.value}</a> : c.value}
              <br />
            </span>
          ))}
        </span>

        <b>Email: </b>
        <span className="email" data-user={email} data-domain={domain}>
          {email && domain ? `${email}@${domain}` : ""}
        </span>
      </div>
    </header>
  );
}

function ProfileSection({ profile }) {
  return (
    <section className="profile">
      <h2>Profile</h2>
      <ul className="client">
        {profile.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </section>
  );
}

function SkillsSection({ skills }) {
  return (
    <section className="skills-container">
      <h2>Skills Summary</h2>
      <div className="level1">
        <table className="skill">
          <tbody>
            {skills.map((s) => (
              <tr key={s.id} className="skill-row">
                <td className="skill-type-header" nowrap="nowrap">
                  <b className="skill-type">{s.type}</b>
                </td>
                <td className="skill-content">
                  {s.mainDetails && s.mainDetails.map((md, mdi) => (
                    <span key={mdi}>
                      <span dangerouslySetInnerHTML={{ __html: (md.description ? `<b>${md.description}:</b> ` : "") + md.html }} />
                      <br />
                    </span>
                  ))}
                  {s.values.map((v, idx) => (
                    <span key={idx}>
                      <span dangerouslySetInnerHTML={{ __html: (v.description ? `<b>${v.description}:</b> ` : "") + v.html }} />
                      <br />
                    </span>
                  ))}
                  {s.details && s.details.length > 0 ? (
                    <SkillDetailsToggle id={s.id} details={s.details} />
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SkillDetailsToggle({ id, details }) {
  const [visible, setVisible] = useState(false);
  if (!details || details.length === 0) return null;
  const detailsId = `${id}-details`;
  return (
    <>
      {!visible ? (
        <a href="#" onClick={(e) => { e.preventDefault(); setVisible(true); }} className={`action-show ${detailsId}`}>More details</a>
      ) : (
        <>
          <a href="#" onClick={(e) => { e.preventDefault(); setVisible(false); }} className={`action-hide`} style={{ display: 'none' }}>More details</a>
          <span className={`details-body ${detailsId}`}>
            <span className="details-content">
              {details.map((d, i) => (
                <>
                  <span key={i} className="detail-item" dangerouslySetInnerHTML={{ __html: (d.description ? `<b>${d.description}:</b> ` : "") + d.html }} />
                  <br />
                </>
              ))}
            </span>
            <a href="#" onClick={(e) => { e.preventDefault(); setVisible(false); }} className="action-hide">Hide details</a>
          </span>
        </>
      )}
    </>
  );
}

function WorkHistory({ work }) {
  return (
    <section className="work-history">
      <h3>Work History</h3>
      {work.main.map((c) => (
        <div key={c.id} className="company">
          <h4 dangerouslySetInnerHTML={{ __html: c.headerHtml }} />
          <div className="dates">{c.startDate} — {c.endDate}</div>
          {c.assignments.map((a) => (
            <div key={a.id} className="assignment">
              <div className="asgn-header" dangerouslySetInnerHTML={{ __html: a.headerHtml }} />
              {a.descriptionHtml ? <div className="asgn-desc" dangerouslySetInnerHTML={{ __html: a.descriptionHtml }} /> : null}
              <div className="assignment-meta">
                {a.environment ? <div><strong>Environment:</strong> {a.environment}</div> : null}
                {a.tools ? <div><strong>Tools:</strong> {a.tools}</div> : null}
              </div>
              {a.details && a.details.length > 0 ? <AssignmentDetailsToggle id={a.id} details={a.details} /> : null}
            </div>
          ))}
        </div>
      ))}

      {work.more && work.more.length > 0 ? (
        <div id="more-work-section">
          <h3>
            <MoreWorkToggle more={work.more} />
          </h3>
        </div>
      ) : null}
    </section>
  );
}

function AssignmentDetailsToggle({ id, details }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="assignment-details">
      {!visible ? (
        <a href="#" onClick={(e) => { e.preventDefault(); setVisible(true); }} className={`action-show ${id}`}>More details</a>
      ) : (
        <div className={`details-body ${id}`}>
          <div className="details-content">
            {details.map((d, i) => (
              <div key={i} className="level3" dangerouslySetInnerHTML={{ __html: d }} />
            ))}
          </div>
          <a href="#" onClick={(e) => { e.preventDefault(); setVisible(false); }} className="action-hide">Hide details</a>
        </div>
      )}
    </div>
  );
}

function MoreWorkToggle({ more }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {!open ? (
        <a href="#" onClick={(e) => { e.preventDefault(); setOpen(true); }} className="action-show work-history-more">More work history</a>
      ) : (
        <div className="work-history-more">
          <div className="more-content">
            {more.map((c) => (
              <div key={c.id} className="company" dangerouslySetInnerHTML={{ __html: c.headerHtml }} />
            ))}
          </div>
          <a href="#" onClick={(e) => { e.preventDefault(); setOpen(false); }} className="action-hide">Less work history</a>
        </div>
      )}
    </>
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
      <Header name={data.name} title={data.title} contacts={data.contacts} email={data.email} domain={data.domain} />
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
    email: root.getAttribute("email") || "",
    domain: root.getAttribute("domain") || "",
    updated: root.getAttribute("updated") || "",
    contacts: [],
    profile: [],
    skills: [],
    work: { main: [], more: [] },
  };

  resume.contacts = Array.from(doc.querySelectorAll("contact-list > contact")).map((c) => ({
    type: c.getAttribute("type") || "",
    value: c.getAttribute("value") || c.textContent.trim() || "",
    url: (c.getAttribute("value") || "").startsWith("http") ? (c.getAttribute("value") || "") : null,
  }));

  resume.profile = Array.from(doc.querySelectorAll("profile > entry")).map((e) => e.textContent.trim());

  resume.skills = Array.from(doc.querySelectorAll("skill-list > skill")).map((s) => {
    const id = s.getAttribute("id") || s.querySelector("type")?.textContent.trim() || Math.random().toString(36).slice(2);
    const type = s.querySelector("type")?.textContent.trim() || "";
    const mainDetails = Array.from(s.querySelectorAll("main-detail")).map((md) => ({
      description: md.getAttribute("description") || "",
      html: md.innerHTML.trim(),
    }));

    // top-level values (direct children)
    const values = Array.from(s.querySelectorAll("value")).filter(v => v.parentElement === s).map((v) => ({
      description: v.getAttribute("description") || "",
      html: v.innerHTML.trim(),
      text: v.textContent.trim(),
    }));

    // nested detail values inside skill-details
    const details = Array.from(s.querySelectorAll("skill-details value")).map((v) => ({
      description: v.getAttribute("description") || "",
      html: v.innerHTML.trim(),
    }));

    return { id, type, mainDetails, values, details };
  });

  // Main work history
  const mainCompanies = Array.from(doc.querySelectorAll("work-history > company"));
  resume.work.main = mainCompanies.map((c) => {
    const id = c.getAttribute("id") || Math.random().toString(36).slice(2);
    const headerHtml = formatURL(c.getAttribute("url"), c.getAttribute("name")) + (c.getAttribute("department") ? `, ${c.getAttribute("department")}` : "");
    const startDate = c.getAttribute("startDate") || "";
    const endDate = c.getAttribute("endDate") || "";
    const assignments = Array.from(c.querySelectorAll("assignment")).map((a) => ({
      id: a.getAttribute("id") || Math.random().toString(36).slice(2),
      headerHtml: formatURL(a.getAttribute("url"), a.getAttribute("name")) + (a.getAttribute("department") ? `, ${a.getAttribute("department")}` : ""),
      environment: a.querySelector("assignment-environment")?.textContent.trim() || "",
      tools: a.querySelector("assignment-tools")?.textContent.trim() || "",
      descriptionHtml: a.querySelector("assignment-description")?.innerHTML.trim() || "",
      details: Array.from(a.querySelectorAll("assignment-details > detail")).map(d => d.innerHTML.trim()),
    }));
    return { id, headerHtml, startDate, endDate, assignments };
  });

  // More work history
  const moreCompanies = Array.from(doc.querySelectorAll("work-history-more > company"));
  resume.work.more = moreCompanies.map((c) => ({
    id: c.getAttribute("id") || Math.random().toString(36).slice(2),
    headerHtml: formatURL(c.getAttribute("url"), c.getAttribute("name")) + (c.getAttribute("department") ? `, ${c.getAttribute("department")}` : ""),
  }));

  return resume;
}

function formatURL(url, name) {
  if (!url) return name || "";
  const full = url.startsWith("http") ? url : `http://${url}`;
  return `<a href=\"${full}\" target=\"_blank\">${name || url}</a>`;
}

export default Resume;
