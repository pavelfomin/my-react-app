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
  const [moreWorkOpen, setMoreWorkOpen] = useState(false);

  return (
    <section className="work-history-container">
      <h2>Work History</h2>
      <div id="main-work">
        {work.main.map((c) => (
          <CompanyBlock key={c.id} company={c} />
        ))}
      </div>

      {work.more && work.more.length > 0 ? (
        <div id="more-work-section">
          <div id="more-history-toggle">
            {!moreWorkOpen ? (
              <h2>
                <a
                  href="#"
                  className="action-show work-history-more"
                  data-element-id="work-history-more"
                  onClick={(e) => {
                    e.preventDefault();
                    setMoreWorkOpen(true);
                  }}
                >
                  More work history
                </a>
              </h2>
            ) : (
              <>
                <div id="work-history-more" className="work-history-more">
                  <div className="more-content">
                    {work.more.map((c) => (
                      <CompanyBlock key={c.id} company={c} />
                    ))}
                  </div>
                </div>
              </>
            )}

            {moreWorkOpen && (
              <h2>
                <a
                  href="#"
                  className="action-hide"
                  data-element-id="work-history-more"
                  onClick={(e) => {
                    e.preventDefault();
                    setMoreWorkOpen(false);
                  }}
                >
                  Less work history
                </a>
              </h2>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function CompanyBlock({ company }) {
  return (
    <div className="level1">
      <table className="company">
        <tbody>
          <tr>
            <td className="comp-header position" dangerouslySetInnerHTML={{ __html: company.headerHtml }} />
          </tr>
          <tr>
            <td className="comp-pos position">{company.position}</td>
            <td className="comp-date position">{company.startDate} - {company.endDate}</td>
          </tr>
        </tbody>
      </table>
      <div className="assignments-container">
        {company.assignments.map((a) => (
          <AssignmentBlock key={a.id} assignment={a} />
        ))}
      </div>
    </div>
  );
}

function AssignmentBlock({ assignment }) {
  const [showDetails, setShowDetails] = useState(false);
  const detailsId = `${assignment.id}-details`;

  return (
    <div className="level2">
      <div className="asgn-header client" dangerouslySetInnerHTML={{ __html: assignment.headerHtml }} />
      <table className="assignment">
        <tbody>
          {assignment.environment && (
            <tr className="env-row">
              <td><b>Environment:</b>&nbsp;</td>
              <td className="env-val">{assignment.environment}</td>
            </tr>
          )}
          {assignment.tools && (
            <tr className="tools-row">
              <td><b>Tools:</b>&nbsp;</td>
              <td className="tools-val">{assignment.tools}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="asgn-desc level3">
        {assignment.descriptionHtml && (
          <span className="desc-text" dangerouslySetInnerHTML={{ __html: assignment.descriptionHtml }} />
        )}
        {assignment.details && assignment.details.length > 0 ? (
          <a
            href="#"
            className={`action-show ${detailsId}`}
            data-element-id={detailsId}
            onClick={(e) => {
              e.preventDefault();
              setShowDetails(true);
            }}
            style={{ display: showDetails ? "none" : "inline" }}
          >
            More details
          </a>
        ) : null}
      </div>

      {assignment.details && assignment.details.length > 0 ? (
        <div
          className={`details-body ${detailsId}`}
          style={{ display: showDetails ? "block" : "none" }}
        >
          <div className="details-content">
            {assignment.details.map((d, i) => (
              <div key={i} className="level3" dangerouslySetInnerHTML={{ __html: d }} />
            ))}
          </div>
          <div className="level3">
            <a
              href="#"
              className="action-hide"
              data-element-id={detailsId}
              onClick={(e) => {
                e.preventDefault();
                setShowDetails(false);
              }}
            >
              Hide details
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EducationSection({ education }) {
  return (
    <div id="education-container">
      <h2>Education</h2>
      <div className="education-list">
        {education && education.map((e) => (
          <div key={e.id} className="level1">
            <span className="edu-school">
              {e.schoolUrl ? (
                <a href={e.schoolUrl.startsWith("http") ? e.schoolUrl : `http://${e.schoolUrl}`} target="_blank" rel="noreferrer">
                  {e.school}
                </a>
              ) : (
                e.school
              )}
            </span>
            <br />
            <b className="edu-award">
              {e.award}
              {e.year ? `, ${e.year}` : ""}
            </b>
            <br />
            <span className="edu-desc">{e.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FooterSection({ updated }) {
  // Parse updated field: "$Date: 2025/05/04 $" -> "2025/05/04"
  let cleanDate = "";
  if (updated && updated.includes(":") && updated.includes("$")) {
    cleanDate = updated.split(":")[1].split("$")[0].trim();
  } else {
    cleanDate = updated || "";
  }

  return (
    <div id="footer-container">
      <hr />
      <div id="footer" className="footer">
        Last modified: <span className="last-modified">{cleanDate}</span>
      </div>
    </div>
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

    // Setup delegated event listeners for action-show and action-hide
    const handleShowClick = (e) => {
      if (e.target.classList.contains("action-show")) {
        e.preventDefault();
        const elementId = e.target.getAttribute("data-element-id");
        if (elementId) {
          const elements = document.querySelectorAll(`.${elementId}`);
          elements.forEach((el) => el.style.display = "");
          e.target.style.display = "none";
        }
      }
    };

    const handleHideClick = (e) => {
      if (e.target.classList.contains("action-hide")) {
        e.preventDefault();
        const parent = e.target.closest(".resume");
        if (parent) {
          const elementId = e.target.getAttribute("data-element-id");
          if (elementId) {
            const elements = parent.querySelectorAll(`.${elementId}`);
            elements.forEach((el) => el.style.display = "none");
            const showLink = parent.querySelector(`a.action-show.${elementId}`);
            if (showLink) showLink.style.display = "";
          }
        }
      }
    };

    const resumeElement = document.querySelector(".resume");
    if (resumeElement) {
      resumeElement.addEventListener("click", handleShowClick);
      resumeElement.addEventListener("click", handleHideClick);
    }

    return () => {
      mounted = false;
      if (resumeElement) {
        resumeElement.removeEventListener("click", handleShowClick);
        resumeElement.removeEventListener("click", handleHideClick);
      }
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
      <EducationSection education={data.education} />
      <FooterSection updated={data.updated} />
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
    education: [],
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
  resume.work.main = parseCompanies(mainCompanies);

  // More work history
  const moreCompanies = Array.from(doc.querySelectorAll("work-history-more > company"));
  resume.work.more = parseCompanies(moreCompanies);

  // Education
  resume.education = Array.from(doc.querySelectorAll("education > degree")).map((d) => ({
    id: d.getAttribute("id") || Math.random().toString(36).slice(2),
    school: d.getAttribute("school") || "",
    schoolUrl: d.getAttribute("url") || "",
    award: d.getAttribute("award") || "",
    year: d.getAttribute("year") || "",
    description: d.textContent.trim() || "",
  }));

  return resume;
}

function formatURL(url, name) {
  if (!url) return name || "";
  const full = url.startsWith("http") ? url : `http://${url}`;
  return `<a href=\"${full}\" target=\"_blank\">${name || url}</a>`;
}

function parseCompanies(companies) {
  return companies.map((c) => {
    const id = c.getAttribute("id") || Math.random().toString(36).slice(2);
    const headerHtml = formatURL(c.getAttribute("url"), c.getAttribute("name")) + (c.getAttribute("department") ? `, ${c.getAttribute("department")}` : "");
    const position = c.getAttribute("position") || "";
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
    return { id, headerHtml, position, startDate, endDate, assignments };
  });
}

export default Resume;
