import { useState } from "react";
import "./App.css";
import "./Stats.css";
import Header from "./components/Header";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
}

interface ChallengeStats {
  totalChallenges: number;
  completedChallenges: number;
  completionRate: number;
}

interface MoodEntry {
  date: string;
  mood: number; // 1-5
}

interface WeeklyActivity {
  day: string;
  appOpens: number;
  minutes: number;
}

function Stats() {
  const [userRole] = useState(localStorage.getItem("userRole") || "");
  const [streakData] = useState<StreakData>({
    currentStreak: 8,
    longestStreak: 15,
  });

  const [challengeStats] = useState<ChallengeStats>({
    totalChallenges: 12,
    completedChallenges: 9,
    completionRate: 75,
  });

  const [moodData] = useState<MoodEntry[]>([
    { date: "Pon", mood: 4 },
    { date: "Uto", mood: 3 },
    { date: "Sri", mood: 5 },
    { date: "Čet", mood: 4 },
    { date: "Pet", mood: 4 },
    { date: "Sub", mood: 5 },
    { date: "Ned", mood: 3 },
  ]);

  const [weeklyActivity] = useState<WeeklyActivity[]>([
    { day: "Pon", appOpens: 3, minutes: 45 },
    { day: "Uto", appOpens: 2, minutes: 30 },
    { day: "Sri", appOpens: 4, minutes: 60 },
    { day: "Čet", appOpens: 2, minutes: 25 },
    { day: "Pet", appOpens: 3, minutes: 50 },
    { day: "Sub", appOpens: 5, minutes: 75 },
    { day: "Ned", appOpens: 1, minutes: 15 },
  ]);

  const averageMood = (moodData.reduce((sum, entry) => sum + entry.mood, 0) / moodData.length).toFixed(1);

  return (
    <>
      <div className="background">
        <div className="statsContainer">
          <Header userRole={userRole} />

          <div className="statsGrid">
            {/* Nizovi */}
            <div className="statCard">
              <div className="cardHeader">
                <h3 className="cardTitle">Nizovi korištenja</h3>
              </div>
              <div className="cardContent">
                <div className="streakStats">
                  <div className="streakItem">
                    <p className="streakLabel">Trenutni niz</p>
                    <p className="streakNumber">{streakData.currentStreak}</p>
                    <p className="streakUnit">dana</p>
                  </div>
                  <div className="streakDivider"></div>
                  <div className="streakItem">
                    <p className="streakLabel">Najduži niz</p>
                    <p className="streakNumber">{streakData.longestStreak}</p>
                    <p className="streakUnit">dana</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Izazovi */}
            <div className="statCard">
              <div className="cardHeader">
                <h3 className="cardTitle">Izazovi</h3>
              </div>
              <div className="cardContent">
                <div className="challengeStats">
                  <div className="progressRing">
                    <svg viewBox="0 0 100 100" className="ringChart">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e5e5e5"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#7636BB"
                        strokeWidth="8"
                        strokeDasharray={`${(45 * 2 * Math.PI * challengeStats.completionRate) / 100} ${45 * 2 * Math.PI}`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                      <text
                        x="50"
                        y="50"
                        textAnchor="middle"
                        dy="0.3em"
                        className="ringText"
                      >
                        {challengeStats.completionRate}%
                      </text>
                    </svg>
                  </div>
                  <div className="challengeDetails">
                    <p className="challengeDetail">
                      <span className="detailLabel">Ukupno:</span>
                      <span className="detailValue">{challengeStats.totalChallenges}</span>
                    </p>
                    <p className="challengeDetail">
                      <span className="detailLabel">Završeno:</span>
                      <span className="detailValue" style={{ color: "#7636BB" }}>
                        {challengeStats.completedChallenges}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trend raspoloženja */}
          <div className="statCard fullWidth">
            <div className="cardHeader moodHeader">
              <h3 className="cardTitle">Trend raspoloženja</h3>
              <div className="averageMoodBadge">
                <p className="averageMoodLabel">Prosječno raspoloženje</p>
                <p className="averageMoodValue">{averageMood}</p>
              </div>
            </div>
            {/* Ocrtavanje grafa */}
            <div className="cardContent chartContent">
              <div className="chartContainer">
                <svg className="moodChart" viewBox="0 0 700 300" preserveAspectRatio="xMidYMid meet">
                  <line x1="50" y1="30" x2="50" y2="250" stroke="#999" strokeWidth="1" />
                  <line x1="50" y1="250" x2="700" y2="250" stroke="#999" strokeWidth="1" />
                  
                  {/* tekst na y-osi */}
                  {[1, 2, 3, 4, 5].map((val) => (
                    <text key={val} x="30" y={250 - (val - 1) * 55 + 5} fontSize="12" fill="#666" textAnchor="end">
                      {val}
                    </text>
                  ))}
                  
                  <text x="20" y="140" fontSize="11" fill="#666" textAnchor="middle" transform="rotate(-90 20 140)">
                    Raspoloženje
                  </text>

                  {/* horizontalne crte */}
                  {[1, 2, 3, 4].map((val) => (
                    <line key={val} x1="50" y1={250 - val * 55} x2="700" y2={250 - val * 55} stroke="#e5e5e5" strokeWidth="1" strokeDasharray="3,3" />
                  ))}

                  {/* Izračun za točke */}
                  {(() => {
                    const width = 630;
                    const pointSpacing = width / (moodData.length - 1);
                    const points = moodData.map((entry, idx) => {
                      const x = 50 + idx * pointSpacing;
                      const y = 250 - (entry.mood - 1) * 55;
                      return `${x},${y}`;
                    }).join(" ");
                    return (
                      <>
                        <polyline points={points} fill="none" stroke="#7636BB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        {moodData.map((entry, idx) => {
                          const x = 50 + idx * pointSpacing;
                          const y = 250 - (entry.mood - 1) * 55;
                          return (
                            <circle key={idx} cx={x} cy={y} r="5" fill="#7636BB" />
                          );
                        })}
                      </>
                    );
                  })()}

                  {/* tekst na x-osi */}
                  {moodData.map((entry, idx) => {
                    const width = 630;
                    const pointSpacing = width / (moodData.length - 1);
                    const x = 50 + idx * pointSpacing;
                    return (
                      <text key={idx} x={x} y="275" fontSize="12" fill="#666" textAnchor="middle">
                        {entry.date}
                      </text>
                    );
                  })}
                </svg>
              </div>
              {/* Legenda za graf raspoloženja */}
              <div className="moodLegend">
                {[
                  { num: 1, label: "Vrlo loše" },
                  { num: 2, label: "Loše" },
                  { num: 3, label: "Neutralno" },
                  { num: 4, label: "Dobro" },
                  { num: 5, label: "Odlično" }
                ].map((mood) => (
                  <div key={mood.num} className="moodLegendItem">
                    <span className="moodLegendNumber">{mood.num}</span>
                    <span className="moodLegendLabel">{mood.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Activity Charts */}
          <div className="activityChartsWrapper">
            {/* Graf broja otvaranja po danu */}
            <div className="statCard">
              <div className="cardHeader">
                <h3 className="cardTitle">Broj otvaranja po danu</h3>
              </div>
              <div className="cardContent chartContent">
                <div className="activityChartContainer">
                  <div className="activityBarsContainer">
                    {weeklyActivity.map((day) => {
                      const maxActivities = Math.max(...weeklyActivity.map(d => d.appOpens));
                      const activityHeight = (day.appOpens / maxActivities) * 140;
                      
                      return (
                        <div key={day.day} className="activityBarGroup">
                          <div className="barsWrapper">
                            <div 
                              className="bar appOpensBar"
                              style={{ height: `${activityHeight}px` }}
                              title={`${day.day}: ${day.appOpens} otvaranja`}
                            >
                              <span className="barLabel">{day.appOpens}</span>
                            </div>
                          </div>
                          <div className="barDayLabel">{day.day}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Graf dnevne aktivnosti */}
            <div className="statCard">
              <div className="cardHeader">
                <h3 className="cardTitle">Dnevna aktivnost</h3>
              </div>
              <div className="cardContent chartContent">
                <div className="activityChartContainer">
                  <div className="activityBarsContainer">
                    {weeklyActivity.map((day) => {
                      const maxMinutes = Math.max(...weeklyActivity.map(d => d.minutes));
                      const minutesHeight = (day.minutes / maxMinutes) * 140;
                      
                      return (
                        <div key={day.day} className="activityBarGroup">
                          <div className="barsWrapper">
                            <div 
                              className="bar minutesBar"
                              style={{ height: `${minutesHeight}px` }}
                              title={`${day.day}: ${day.minutes} minuta`}
                            >
                              <span className="barLabel">{day.minutes}</span>
                            </div>
                          </div>
                          <div className="barDayLabel">{day.day}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Tjedni sažetak */}
            <div className="statCard">
              <h3 className="cardTitle">Ovaj tjedan</h3>
              <div className="summaryContentVertical">
                <div className="summaryItemVertical">
                  <p className="summaryLabel">Ukupno otvaranja</p>
                  <p className="summaryValue">
                    {weeklyActivity.reduce((sum, day) => sum + day.appOpens, 0)}
                  </p>
                </div>
                <div className="summaryItemVertical">
                  <p className="summaryLabel">Ukupna aktivnost (min)</p>
                  <p className="summaryValue">
                    {weeklyActivity.reduce((sum, day) => sum + day.minutes, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Stats;
