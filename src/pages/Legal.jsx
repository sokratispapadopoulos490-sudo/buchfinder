import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Shield, Users, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Legal() {
  const [activeSection, setActiveSection] = useState('terms');
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const section = params.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, []);

  const sections = {
    terms: {
      title: 'Nutzungsbedingungen',
      icon: FileText,
      content: (
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">1. Geltungsbereich</h3>
            <p className="text-stone-600 leading-relaxed">
              Diese Nutzungsbedingungen gelten für die Nutzung der Book Compass App ("die App"). 
              Durch die Nutzung der App erklären Sie sich mit diesen Bedingungen einverstanden.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">2. Nutzerkonto</h3>
            <p className="text-stone-600 leading-relaxed mb-2">
              Für die Nutzung der App ist die Erstellung eines Nutzerkontos erforderlich. Sie verpflichten sich:
            </p>
            <ul className="list-disc list-inside space-y-1 text-stone-600 ml-4">
              <li>Wahrheitsgemäße Angaben zu machen</li>
              <li>Ihre Zugangsdaten vertraulich zu behandeln</li>
              <li>Unbefugte Nutzung Ihres Kontos zu verhindern</li>
              <li>Uns unverzüglich über missbräuchliche Nutzung zu informieren</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">3. Nutzungsrechte und -pflichten</h3>
            <p className="text-stone-600 leading-relaxed mb-2">
              Sie dürfen die App ausschließlich für private, nicht-kommerzielle Zwecke nutzen. Untersagt sind insbesondere:
            </p>
            <ul className="list-disc list-inside space-y-1 text-stone-600 ml-4">
              <li>Die Verbreitung von illegalen, beleidigenden oder irreführenden Inhalten</li>
              <li>Eingriffe in die technische Infrastruktur der App</li>
              <li>Die automatisierte Datenextraktion (Scraping)</li>
              <li>Die Umgehung von Sicherheitsmechanismen</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">4. Inhalte und Urheberrechte</h3>
            <p className="text-stone-600 leading-relaxed">
              Sie behalten die Rechte an den von Ihnen erstellten Inhalten (Bewertungen, Kommentare, Zitate). 
              Durch das Veröffentlichen räumen Sie uns jedoch ein nicht-exklusives, weltweites Nutzungsrecht 
              ein, um diese Inhalte im Rahmen der App-Funktionen bereitzustellen.
            </p>
            <p className="text-stone-600 leading-relaxed mt-2">
              Sie versichern, dass Sie über die erforderlichen Rechte an den von Ihnen hochgeladenen Inhalten verfügen.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">5. Premium-Funktionen</h3>
            <p className="text-stone-600 leading-relaxed">
              Einige Funktionen der App sind kostenpflichtig (Premium). Die Zahlung erfolgt über Stripe. 
              Es gelten die jeweiligen Preise und Laufzeiten zum Zeitpunkt des Vertragsabschlusses. 
              Kündigungen können jederzeit erfolgen.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">6. Haftung</h3>
            <p className="text-stone-600 leading-relaxed">
              Wir bemühen uns um einen störungsfreien Betrieb, übernehmen jedoch keine Gewähr für 
              ständige Verfügbarkeit. Die Haftung für Schäden ist auf Vorsatz und grobe Fahrlässigkeit beschränkt.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">7. Änderungen</h3>
            <p className="text-stone-600 leading-relaxed">
              Wir behalten uns vor, diese Nutzungsbedingungen zu ändern. Über wesentliche Änderungen 
              werden Sie per E-Mail informiert. Die weitere Nutzung der App gilt als Zustimmung.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">8. Kündigung</h3>
            <p className="text-stone-600 leading-relaxed">
              Sie können Ihr Nutzerkonto jederzeit löschen. Wir behalten uns vor, Konten bei Verstößen 
              gegen diese Nutzungsbedingungen zu sperren oder zu löschen.
            </p>
          </section>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-8">
            <p className="text-sm text-amber-800">
              <strong>Stand:</strong> Februar 2026
            </p>
          </div>
        </div>
      )
    },
    privacy: {
      title: 'Datenschutzerklärung',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">1. Verantwortlicher</h3>
            <p className="text-stone-600 leading-relaxed">
              Verantwortlich für die Datenverarbeitung ist der Betreiber der App (siehe Impressum).
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">2. Erhobene Daten</h3>
            <p className="text-stone-600 leading-relaxed mb-2">Wir erheben und verarbeiten folgende Daten:</p>
            <ul className="list-disc list-inside space-y-1 text-stone-600 ml-4">
              <li><strong>Kontodaten:</strong> E-Mail-Adresse, Name, Passwort (verschlüsselt)</li>
              <li><strong>Profildaten:</strong> Biografie, Lieblingsgenres, Leseziele</li>
              <li><strong>Nutzungsdaten:</strong> Gespeicherte Bücher, Bewertungen, Kommentare, Zitate</li>
              <li><strong>Technische Daten:</strong> IP-Adresse, Browser-Typ, Geräteinformationen</li>
              <li><strong>Zahlungsdaten:</strong> Werden ausschließlich von Stripe verarbeitet</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">3. Zweck der Datenverarbeitung</h3>
            <p className="text-stone-600 leading-relaxed mb-2">Ihre Daten werden verarbeitet, um:</p>
            <ul className="list-disc list-inside space-y-1 text-stone-600 ml-4">
              <li>Die App-Funktionen bereitzustellen</li>
              <li>Ihr Nutzerkonto zu verwalten</li>
              <li>Personalisierte Buchempfehlungen zu erstellen (KI-basiert)</li>
              <li>Community-Funktionen zu ermöglichen</li>
              <li>Premium-Abonnements abzuwickeln</li>
              <li>Die Sicherheit der App zu gewährleisten</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">4. Rechtsgrundlage</h3>
            <p className="text-stone-600 leading-relaxed">
              Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), 
              zur Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO) und aufgrund berechtigter Interessen 
              (Art. 6 Abs. 1 lit. f DSGVO).
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">5. Weitergabe von Daten</h3>
            <p className="text-stone-600 leading-relaxed mb-2">
              Wir geben Ihre Daten nur in folgenden Fällen weiter:
            </p>
            <ul className="list-disc list-inside space-y-1 text-stone-600 ml-4">
              <li><strong>Stripe:</strong> Zahlungsabwicklung für Premium-Funktionen</li>
              <li><strong>OpenAI/KI-Dienste:</strong> Zur Erstellung personalisierter Empfehlungen (anonymisiert)</li>
              <li><strong>Hosting-Provider:</strong> Zur technischen Bereitstellung der App</li>
              <li><strong>Gesetzliche Verpflichtungen:</strong> Bei behördlichen Anfragen</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">6. Speicherdauer</h3>
            <p className="text-stone-600 leading-relaxed">
              Ihre Daten werden gespeichert, solange Ihr Konto aktiv ist. Nach Löschung Ihres Kontos 
              werden die Daten innerhalb von 30 Tagen gelöscht, soweit keine gesetzlichen Aufbewahrungspflichten bestehen.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">7. Ihre Rechte</h3>
            <p className="text-stone-600 leading-relaxed mb-2">Sie haben folgende Rechte:</p>
            <ul className="list-disc list-inside space-y-1 text-stone-600 ml-4">
              <li><strong>Auskunft:</strong> Informationen über Ihre gespeicherten Daten</li>
              <li><strong>Berichtigung:</strong> Korrektur falscher Daten</li>
              <li><strong>Löschung:</strong> Entfernung Ihrer Daten ("Recht auf Vergessenwerden")</li>
              <li><strong>Einschränkung:</strong> Sperrung der Verarbeitung</li>
              <li><strong>Datenübertragbarkeit:</strong> Export Ihrer Daten</li>
              <li><strong>Widerspruch:</strong> Widerspruch gegen die Verarbeitung</li>
              <li><strong>Beschwerde:</strong> Bei einer Datenschutzbehörde</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">8. Cookies und Tracking</h3>
            <p className="text-stone-600 leading-relaxed">
              Die App verwendet technisch notwendige Cookies zur Authentifizierung. 
              Analyse- oder Marketing-Cookies werden nicht eingesetzt.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">9. Sicherheit</h3>
            <p className="text-stone-600 leading-relaxed">
              Wir setzen technische und organisatorische Maßnahmen zum Schutz Ihrer Daten ein, 
              darunter Verschlüsselung, Zugriffskontrollen und regelmäßige Sicherheitsupdates.
            </p>
          </section>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-8">
            <p className="text-sm text-amber-800">
              <strong>Stand:</strong> Februar 2026
            </p>
          </div>
        </div>
      )
    },
    community: {
      title: 'Community-Richtlinien',
      icon: Users,
      content: (
        <div className="space-y-6">
          <p className="text-stone-600 leading-relaxed">
            Book Compass ist eine Community für Buchliebhaber. Um ein positives und respektvolles 
            Umfeld zu gewährleisten, bitten wir alle Nutzer, folgende Richtlinien zu beachten.
          </p>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">1. Respektvoller Umgang</h3>
            <ul className="list-disc list-inside space-y-1 text-stone-600 ml-4">
              <li>Behandle andere mit Respekt und Höflichkeit</li>
              <li>Keine Beleidigungen, Hassrede oder Diskriminierung</li>
              <li>Akzeptiere unterschiedliche Meinungen und Geschmäcker</li>
              <li>Konstruktive Kritik ist willkommen, persönliche Angriffe nicht</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">2. Angemessene Inhalte</h3>
            <ul className="list-disc list-inside space-y-1 text-stone-600 ml-4">
              <li>Keine pornografischen, gewalttätigen oder verstörenden Inhalte</li>
              <li>Keine Spoiler ohne Warnung</li>
              <li>Keine Werbung oder Spam</li>
              <li>Respektiere Urheberrechte (z.B. bei Zitaten)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">3. Authentizität</h3>
            <ul className="list-disc list-inside space-y-1 text-stone-600 ml-4">
              <li>Sei du selbst, keine Fake-Accounts</li>
              <li>Ehrliche Bewertungen und Meinungen</li>
              <li>Keine koordinierten Aktionen zur Manipulation von Bewertungen</li>
              <li>Gib Quellen an, wenn du fremde Inhalte teilst</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">4. Datenschutz</h3>
            <ul className="list-disc list-inside space-y-1 text-stone-600 ml-4">
              <li>Teile keine persönlichen Daten anderer Nutzer</li>
              <li>Respektiere die Privatsphäre anderer</li>
              <li>Achte auf deine eigene Privatsphäre bei öffentlichen Posts</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">5. Meldungen</h3>
            <p className="text-stone-600 leading-relaxed">
              Wenn du auf Inhalte stößt, die gegen diese Richtlinien verstoßen, nutze bitte die 
              Melde-Funktion. Wir prüfen alle Meldungen und ergreifen geeignete Maßnahmen.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">6. Konsequenzen bei Verstößen</h3>
            <p className="text-stone-600 leading-relaxed mb-2">
              Verstöße gegen diese Richtlinien können folgende Konsequenzen haben:
            </p>
            <ul className="list-disc list-inside space-y-1 text-stone-600 ml-4">
              <li>Warnung</li>
              <li>Entfernung von Inhalten</li>
              <li>Temporäre Sperrung</li>
              <li>Permanente Sperrung des Accounts</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">7. KI-Interaktionen</h3>
            <p className="text-stone-600 leading-relaxed">
              Premium-Nutzer können die Book Compass KI in Diskussionen einbinden. 
              Die KI soll konstruktiv und hilfreich sein. Missbrauch der KI-Funktion ist nicht gestattet.
            </p>
          </section>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
            <p className="text-sm text-blue-800 leading-relaxed">
              <strong>Unser Ziel:</strong> Eine inspirierende, unterstützende Community, 
              in der sich alle Buchliebhaber wohlfühlen und austauschen können. 
              Gemeinsam machen wir Book Compass zu einem besseren Ort!
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-amber-800">
              <strong>Stand:</strong> Februar 2026
            </p>
          </div>
        </div>
      )
    },
    imprint: {
      title: 'Impressum',
      icon: Building,
      content: (
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">Angaben gemäß § 5 TMG</h3>
            <div className="bg-stone-50 rounded-lg p-4 space-y-2 text-stone-600">
              <p><strong>Betreiber:</strong> [Name/Firma]</p>
              <p><strong>Anschrift:</strong> [Straße und Hausnummer]</p>
              <p>[PLZ und Ort]</p>
              <p>[Land]</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">Kontakt</h3>
            <div className="bg-stone-50 rounded-lg p-4 space-y-2 text-stone-600">
              <p><strong>E-Mail:</strong> [kontakt@beispiel.de]</p>
              <p><strong>Telefon:</strong> [+49 (0) ...]</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">Vertretungsberechtigter</h3>
            <div className="bg-stone-50 rounded-lg p-4 text-stone-600">
              <p>[Name der vertretungsberechtigten Person]</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">Umsatzsteuer-ID</h3>
            <div className="bg-stone-50 rounded-lg p-4 text-stone-600">
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
                [DE123456789]
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
            <div className="bg-stone-50 rounded-lg p-4 space-y-2 text-stone-600">
              <p>[Name]</p>
              <p>[Anschrift]</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">Streitschlichtung</h3>
            <p className="text-stone-600 leading-relaxed">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline ml-1">
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p className="text-stone-600 leading-relaxed mt-2">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">Haftung für Inhalte</h3>
            <p className="text-stone-600 leading-relaxed">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter 
              jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-stone-800 mb-3">Haftung für Links</h3>
            <p className="text-stone-600 leading-relaxed">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
              Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter 
              oder Betreiber der Seiten verantwortlich.
            </p>
          </section>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-8">
            <p className="text-sm text-amber-800">
              <strong>Hinweis:</strong> Bitte ersetze die Platzhalter mit deinen tatsächlichen Angaben, 
              bevor die App öffentlich geht.
            </p>
          </div>
        </div>
      )
    }
  };

  const Section = sections[activeSection];
  const Icon = Section.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 px-4 py-6 md:px-6 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-stone-500 hover:text-stone-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-light text-stone-800 flex items-center gap-2">
            <Icon className="w-6 h-6 text-amber-600" />
            {Section.title}
          </h1>
          <div className="w-5" />
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-xl border border-stone-200 p-2 mb-6 flex gap-2 overflow-x-auto">
          {Object.entries(sections).map(([key, section]) => {
            const SectionIcon = section.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
                  activeSection === key
                    ? 'bg-stone-800 text-white'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <SectionIcon className="w-4 h-4" />
                {section.title}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8">
          {Section.content}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-stone-500">
            Bei Fragen zu diesen rechtlichen Hinweisen kannst du uns unter [kontakt@beispiel.de] erreichen.
          </p>
        </div>
      </div>
    </div>
  );
}