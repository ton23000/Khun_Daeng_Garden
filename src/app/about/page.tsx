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
                            <li>มีระบบการจัดส่งที่ปลอดภัย ห่อแพ็คอย่างมืออาชีพ รับประกันความเสียหายระหว่างจัดส่ง</li>
                            <li>พร้อมให้คำปรึกษา แนะนำวิธีการปลูกและดูแลต้นไม้หลังการขาย ฟรี!</li>
                            <li>รีวิวความประทับใจจากลูกค้าจริงกว่าร้อยรายการการันตีคุณภาพ</li>
                        </ul>
                    </section>
                </ScrollAnimation>

                <ScrollAnimation animation="fade-up" delay={300}>
                    <section>
                        <h2 className={styles.sectionTitle}>ภาพบรรยากาศร้าน</h2>
                        <div className={styles.imageGrid}>
                            <img src="https://images.unsplash.com/photo-1585320806297-9794b3e4ce88?w=800&auto=format&fit=crop" className={styles.image} alt="ภาพหน้าร้านสวนคุณแดง 1" />
                            <img src="https://images.unsplash.com/photo-1416879598446-ce5def786df7?w=800&auto=format&fit=crop" className={styles.image} alt="ภาพบรรยากาศในร้าน 1" />
                            <img src="https://images.unsplash.com/photo-1466692476877-3e13d941a868?w=800&auto=format&fit=crop" className={styles.image} alt="ภาพบรรยากาศในร้าน 2" />
                            <img src="https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&auto=format&fit=crop" className={styles.image} alt="เจ้าของร้านกำลังดูแลต้นไม้" />
                        </div>
                    </section>
                </ScrollAnimation>

            </div>
        </div>
    );
}
