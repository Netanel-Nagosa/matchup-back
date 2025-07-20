import { useState } from 'react'
import React from 'react'
import '../styles/about.css'

function About() {
    const [active, setActive] = useState(1);

    const handleTranslate = (e => {
        setActive(active * -1);
    })
    return (
        <div className='blok-about'>
            <div className="blok-about-text">
                <div className="blok-about-text-headline">
                    <h1>ABOUT US : <span style={{ color: "goldenrod" }}>MATCHUP</span></h1>
                    <div className="blok-about-text-headline-translate" onClick={handleTranslate}>
                        {active === 1 ? (
                            <>
                                עברית
                            </>
                        ) : (
                            <>
                                ENGLISH
                            </>
                        )}
                    </div>
                </div>
                <div className="blok-about-text-mainText">
                    {active === 1 ? (
                        <>
                            <b style={{ color: "gold" }}>MATCHUP</b> was founded at the end of 2024 as an alternative platform for sports betting for users over the age of 18.<br />
                            The project reinvents gameplay by encouraging consistency — earn points through regular participation and win monthly prizes.<br />
                            The goal of the application is to provide football fans with a social sports betting experience – play against others, accumulate points, and win prizes.<br />
                            The MatchUp app allows users to place sports bets in a smart and competitive way. The app includes an interface for selecting matches to bet on, tracking live match results, and displaying a user ranking table.<br /><br />
                            <span style={{ background: "goldenrod" ,paddingRight:'81px',paddingLeft:'81px'}}>Special thanks:</span><br />
                            - The odds API <br />
                            - TheSportdb <br />
                            - Chat GPT <br />
                            - Midjurny <br />
                            - Gemini <br />
                            - Google <br />
                            - Apple <br />
                            - UEFA <br />
                            - LG <br />
                            - Mystery box israel <br /><br />
                             We couldent do it without you ! <br /><br />
                            © Netanel Nagosa and Sharon Rada. All rights reserved.<br />
                            This website is a non-commercial project.<br />
                            Final project, Summer 2025 – ORT Rehovot.<br />
                        </>
                    ) : (
                        <div dir="rtl">
                            <b style={{ color: "gold" }}>MATCHUP</b> נוסדה בסוף שנת 2024 בתור אלטרנטיבה חלופית להימורי ספורט מעל גיל 18.<br />
                            הפרויקט מחדש שיטות משחק, בעזרת צבירת נקודות על ידי התמדה, על מנת לזכות בפרסים בכל חודש.<br />
                            מטרת האפליקציה היא לתת לקהל חובבי הכדורגל חוויה חברתית בהימורי ספורט – לשחק מול אנשים, לצבור נקודות ולזכות בפרסים.<br />
                            אפליקציית MatchUp מאפשרת למשתמשים לבצע הימורי ספורט בצורה חכמה ותחרותית. האפליקציה כוללת ממשק שמאפשר בחירת משחקי הימורים, מעקב אחר תוצאות משחקים בלייב והצגת טבלת דירוג המשתמשים.<br /><br />

                            <span style={{ background: "goldenrod", paddingRight:'61px',paddingLeft:'61px' }}>תודות מיוחדת:</span><br />
                            - The odds API <br />
                            - TheSportdb <br />
                            - Chat GPT <br />
                            - Midjurny <br />
                            - Gemini <br />
                            - Google <br />
                            - Apple <br />
                            - UEFA <br />
                            - LG <br />
                            - Mystery box israel <br /><br />
                            לא יכלנו לעשות זאת בלעדייכם !<br /><br />

                            כל הזכויות שמורות לנתנאל נגוסה ושרון רדה<br />
                            האתר אינו אתר למטרות רווח<br />
                            פרויקט גמר, קיץ 2025 – אורט רחובות<br />
                        </div>

                    )}


                </div>
            </div>
        </div>
    )
}

export default About