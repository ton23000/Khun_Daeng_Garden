import { ScrollAnimation } from '@/components/ScrollAnimation';
import styles from './about.module.css';

export default function AboutPage() {
    return (
        <div className={`container ${styles.pageContainer}`}>
            <ScrollAnimation animation="fade-up">
                <h1 className={styles.pageTitle}>เกี่ยวกับร้านสวนคุณแดง</h1>
            </ScrollAnimation>

            <div className={styles.sectionContainer}>
                <ScrollAnimation animation="fade-up" delay={100}>
                    <section>
                        <h2 className={styles.sectionTitle}>ประวัติและความเป็นมา</h2>
                        <p className={styles.addressText}>
                            ตั้งอยู่ที่: 383 ถ.กาญจนวินิช ต.พะวง อ.เมือง จ.สงขลา 90100
                        </p>
                        <p className={styles.bodyText}>
                            ร้านสวนคุณแดง เริ่มต้นจากความรักในการปลูกต้นไม้ และสะสมพันธุ์ไม้สวยงาม ทั้งไม้มงคล ไม้ดอก และไม้ประดับ
                            เราคัดสรรต้นไม้คุณภาพดี แข็งแรง เพื่อส่งต่อความสุขสีเขียวให้กับลูกค้าทุกท่าน
                            ด้วยประสบการณ์กว่า 10 ปี เราพร้อมให้คำแนะนำในการดูแลรักษา เพื่อให้ต้นไม้ของคุณเติบโตอย่างสวยงาม
                        </p>
                    </section>
                </ScrollAnimation>

                <ScrollAnimation animation="fade-up" delay={200}>
                    <section className={styles.highlightSection}>
                        <h2 className={styles.highlightTitle}>ความน่าเชื่อถือของเรา (Store Credit)</h2>
                        <ul className={styles.featureList}>
                            <li>ประสบการณ์การดูแลต้นไม้และจัดสวนมายาวนานกว่า 10 ปี</li>
                            <li>มีหน้าร้านจริงให้เยี่ยมชมและเลือกซื้อต้นไม้ได้ทุกวันด้วยตัวเอง</li>
                            <li>จำหน่ายต้นไม้สุขภาพดี แข็งแรง คัดสรรจากสวนที่ได้มาตรฐาน</li>
                            <li>พร้อมให้คำปรึกษา แนะนำวิธีการปลูกและดูแลต้นไม้หลังการขาย ฟรี!</li>
                            <li>รีวิวความประทับใจจากลูกค้าจริงกว่าร้อยรายการการันตีคุณภาพ</li>
                        </ul>
                    </section>
                </ScrollAnimation>

                <ScrollAnimation animation="fade-up" delay={300}>
                    <section>
                        <h2 className={styles.sectionTitle}>ภาพบรรยากาศร้าน</h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gridAutoRows: '250px',
                            gap: '1rem',
                            marginTop: '1.5rem'
                        }}>
                            {[
                                "104203394_1703567143155216_281949232298706640_n.jpg",
                                "104309994_1703567473155183_2631985199741945479_n.jpg",
                                "124164147_1839269809584948_6344406617013108098_n.jpg",
                                "133283562_1878044269040835_5611542419744234699_n.jpg",
                                "134660006_1878044485707480_4778167200489726984_n.jpg",
                                "301706018_507878381341722_6701819733337717604_n.jpg",
                                "482243530_1214414290688124_541286515667478668_n.jpg"
                            ].map((img, index) => (
                                <ScrollAnimation key={index} animation="fade-up" delay={index * 100} style={{
                                    gridColumn: index === 0 || index === 3 ? 'span 2' : 'span 1',
                                    gridRow: index === 1 ? 'span 2' : 'span 1'
                                }}>
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}>
                                        <img
                                            src={`/images/shop/${img}`}
                                            alt={`ภาพบรรยากาศร้านคุณแดง ${index + 1}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                            className="hover:scale-110"
                                        />
                                    </div>
                                </ScrollAnimation>
                            ))}
                        </div>
                    </section>
                </ScrollAnimation>

            </div>
        </div>
    );
}
