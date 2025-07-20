import React, { useState } from 'react'
import '../styles/howtoplay.css'
import { FaFutbol } from 'react-icons/fa';


function Howtoplay() {
    const [active, setActive] = useState(1);

    const handleTranslate = (e => {
        setActive(active * -1);
    })
    return (
        <div className='howtoplay'>
            <div className="howtoplay-blok">
                <div className="howtoplay-blok-headline">
                    <h1>HOW TO PLAY <span style={{ color: 'goldenrod' }}>MATCHUP <FaFutbol title="football" /> :</span></h1>
                    <div className="howtoplay-blok-headline-translate" onClick={handleTranslate}>
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
                <div className="howtoplay-blok-mainText">
                    {active === 1 ? (
                        <div className='txt txtE' style={{textAlign:'center'}}>

                            The game is very simple<br />
                            When you log into the game, you're taken directly to the GAMES page<br />
                            There, every user is required to place bets on five matches in a form, from dozens of active leagues around the world<br />
                            Each bet selection is automatically sent to the My Bet page, where the form awaits with the winning odds.<br />
                            Changed your mind about a bet you clicked? No problem — you can delete the bet in the My Bet page, or edit it by clicking again on the other team in the same bet.<br />
                            Note: Once the form is submitted, it cannot be changed.<br />
                            The bets are on games up to three days ahead, meaning the maximum time between form submissions is three days.<br />
                            Each submitted form is moved to the Check Win page, where it updates the status of the matches.<br />
                            (In addition, you can view past forms along with success rates, number of forms submitted, and more...)<br />
                            Once the games are over, the system checks and sends a message as soon as the user enters Check Win again:<br />
                            If the form won — a winning message will be sent and the user will receive the points added to the leaderboard<br />
                            If the form lost — a consolation message will be sent, encouraging you to submit a new bet.<br />
                            The leaderboard updates automatically in the Table page, where users can always see their current ranking compared to others<br />
                            Every month, prizes are distributed to the top five players with the highest number of points on the leaderboard<br />
                            (You can check the prizes on the Prizes page)<br />
                            If you win one of the prizes, the next time you log in you’ll receive a winning message and the prize voucher will be sent directly to your email!<br />
                        </div>
                    ) : (
                        <div className='txt txtH' style={{textAlign:'center'}}>
                            המשחק מאוד פשוט <br />
                            כשמתחברים למשחק מגיעים ישירות לעמוד GAMES <br />
                            שבו כל משתמש מחויב להמר על חמישה משחקים בטופס , מעשרות ליגות פעילות מרחבי העולם <br />
                            כל לחיצה על ההימור מעבירה את ההימור לעמוד My Bet , ששם מחכה הטופס עם יחסי הזכייה .<br />
                            התחרטתם על הימור שלחצתם ? הכל בסדר , אפשר למחוק הימור בעמוד My Bet , או לערוך הימור בלחיצה נוספת על הקבוצה השניה באותו הימור .<br />
                            מחדדים ! אחרי שהטופס נשלח אין אפשרות להתחרט.<br />
                            ההימורים הם של משחקים של עד שלושה ימים קדימה , משמע המקסימום שאפשר לחכות בין שליחת טפסים הוא שלושה ימים .<br />
                            כל טופס שנשלח עובר לעמוד Check Win , ששם הוא מעדכן על סטטוס המשחקים .<br />
                            (בנוסף , יש אפשרות לראות את טפסי העבר יחד עם נתוני אחוזה הצלחה , מספר טפסים שנשלחו וכו ..)<br />
                            ברגע שהמשחקים נגמרו , התוכנה עושה בדיקה ושולחת הודעה ברגע שהמשתמש נכנס שוב לCheck Win :<br />
                            אם הטופס זכה , ישלח הודעה של זכיה ויוסיף למשתמש את הנקודות לטבלה<br />
                            אם הטופס נפל , ישלח הודעת ניחומים ויפנה אותך למלא עוד הימור.<br />
                            הטבלה מתעדכנת אוטומטית בעמוד Table , ושם יכול המשתמש לראות כל רגע נתון איפה הוא ביחס לאחרים <br />
                            כל חודש , מתבצעת חלוקת פרסים לפי המיקומים בטבלה לחמשת השחקנים עם מספר הנקודות הגבוהה ביותר <br />
                            (אפשר לברר על הפרסים בעמוד Prizes)<br />
                            אם וזכית באחד מהפרסים , ברגע שתתחבר שוב תקבל הודעה על זכיה ואת השובר לפרס ישירות לאימייל שלך !
                        </div>

                    )}


                </div>
                {/* <div className="howtoplay-blok-main">

                </div> */}
            </div >
        </div >
    )
}

export default Howtoplay