# Annotation Tool React web application
OASIS-Annotator © 2023 is licensed under CC BY 4.0 

## Annotated White Light Images for Oral Cancer Detection: Leveraging OASIS-Annotator a Web-Based Tool for Image Annotation

### Description
The OASIS-Annotator (Oral Assessment and Screening Interactive System - Annotator) is a specialized and customized tool developed with the purpose of facilitating image viewing, annotation, and download. With the OASIS-Annotator, users are able to navigate through the extensive image collection and annotate them by applying customized labels according to their research requirements.

The application provides two distinct user roles: annotator and reviewer, each with their respective privileges and responsibilities. Furthermore, the tool includes a public preview feature, allowing the general public to view and download the images as well as associated annotations.

The OASIS-Annotator allows annotators to annotate images and seek reviews from specialists. Specialists can review the annotations and either request changes or approve them, thereby providing a multi-level assessment of the annotations. The tool facilitates polygon-shaped region annotations with corresponding labels, and the annotation details can be obtained as both polygons and bounding boxes. Additionally, the tool offers the option to download the annotations in the COCO data format, providing compatibility with various data analysis workflows.

Figure 1: Snapshot of drawing board
![tool](https://github.com/Oral-Cavity-Research/Annotation-Tool-Frontend/assets/73728629/f686fc36-c6d7-42c6-ba04-997ebbf76862)


### Background study
Oral cancer is a significant health concern in certain global regions with high mortality and morbidity rates (Figure 1). According to the International Agency for Research on Cancer (IARC), in 2020, there were an estimated 377,713 new cases of lip and oral cavity cancers worldwide, resulting in 177,757 deaths. This places lip and oral cavity cancers as the 16th most common cancer globally, and when combined with oropharyngeal cancers, it rises to the 13th most common cancer. Lip and oral cavity cancer is the 11th most common cancer for men (all ages), with a share of 3.5% of all cancers and it is more prevalent in men compared to women. The leading risk factors for oral cancer include tobacco use, alcohol consumption, and Areca nut (betel quid) use. Figure 1 presents the estimated age-standardized incidence rates of oral and lip cancer across all age groups in 2020.

Figure 2: Estimated age-standardized incidence rates of oral and lip cancer across all age groups in 2020.
![Figure 1: Estimated age-standardized incidence rates of oral and lip cancer across all age groups in 2020.](https://github.com/Oral-Cavity-Research/Annotation-Tool-Frontend/assets/73728629/5611f974-61b4-4766-851a-4bea9f5fbb6f)

Early diagnosis is crucial for oral cancer management, as it can significantly reduce mortality, morbidity, and associated economic burden. Unfortunately, in low- and middle-income countries where 2/3 of the global oral cancer incidence is reported, there are inadequate services for screening.  As a result, researchers have focused on the development of automated technologies to aid in the early diagnosis of oral cancer.

Recently, there has been a growing trend in utilizing machine learning approaches for the early detection of OCA/OPMD using white light images (WLI). The adoption of automated diagnosis, with  WLI, presents a convenient solution for screening oral mucosal diseases. Specially advantages in limited resource settings such as in South Asia where there is a high incidence of oral cancers and a low dentist / dental specialist to population ratio. Although there have been notable advancements in this field, one significant challenge that hinders its progression is the lack of publicly available image databases for training and validation purposes. 

Some researchers have built their own databases to train algorithms using white-light images. This process, however, requires significant time and commitment for data collection, delaying the implementation of the detection algorithms, and posing a challenge to timely research progression.  Publicly available data sets would not only save time and effort for researchers but also encourage the development of more accurate and robust detection algorithms.


### Other
- [Annotation Tool Node Backend](https://github.com/Oral-Cavity-Research/Annotation-Tool-Backend)
- [Flask Backend for ML model](https://github.com/Oral-Cavity-Research/ML-Backend)
