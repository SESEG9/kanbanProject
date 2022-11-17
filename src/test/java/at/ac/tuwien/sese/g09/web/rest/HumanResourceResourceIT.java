package at.ac.tuwien.sese.g09.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import at.ac.tuwien.sese.g09.IntegrationTest;
import at.ac.tuwien.sese.g09.domain.HumanResource;
import at.ac.tuwien.sese.g09.domain.enumeration.Gender;
import at.ac.tuwien.sese.g09.domain.enumeration.HumanResourceType;
import at.ac.tuwien.sese.g09.repository.HumanResourceRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link HumanResourceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class HumanResourceResourceIT {

    private static final HumanResourceType DEFAULT_TYPE = HumanResourceType.RECEPTION;
    private static final HumanResourceType UPDATED_TYPE = HumanResourceType.KITCHEN;

    private static final String DEFAULT_ABBR = "AAAAAAAAAA";
    private static final String UPDATED_ABBR = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_BIRTHDAY = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_BIRTHDAY = LocalDate.now(ZoneId.systemDefault());

    private static final Gender DEFAULT_GENDER = Gender.MALE;
    private static final Gender UPDATED_GENDER = Gender.FEMALE;

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_SSN = "AAAAAAAAAA";
    private static final String UPDATED_SSN = "BBBBBBBBBB";

    private static final String DEFAULT_BANNKING = "AAAAAAAAAA";
    private static final String UPDATED_BANNKING = "BBBBBBBBBB";

    private static final String DEFAULT_RELATIONSHIP_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_RELATIONSHIP_TYPE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/human-resources";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private HumanResourceRepository humanResourceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHumanResourceMockMvc;

    private HumanResource humanResource;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HumanResource createEntity(EntityManager em) {
        HumanResource humanResource = new HumanResource()
            .type(DEFAULT_TYPE)
            .abbr(DEFAULT_ABBR)
            .name(DEFAULT_NAME)
            .birthday(DEFAULT_BIRTHDAY)
            .gender(DEFAULT_GENDER)
            .phone(DEFAULT_PHONE)
            .email(DEFAULT_EMAIL)
            .ssn(DEFAULT_SSN)
            .bannking(DEFAULT_BANNKING)
            .relationshipType(DEFAULT_RELATIONSHIP_TYPE);
        return humanResource;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HumanResource createUpdatedEntity(EntityManager em) {
        HumanResource humanResource = new HumanResource()
            .type(UPDATED_TYPE)
            .abbr(UPDATED_ABBR)
            .name(UPDATED_NAME)
            .birthday(UPDATED_BIRTHDAY)
            .gender(UPDATED_GENDER)
            .phone(UPDATED_PHONE)
            .email(UPDATED_EMAIL)
            .ssn(UPDATED_SSN)
            .bannking(UPDATED_BANNKING)
            .relationshipType(UPDATED_RELATIONSHIP_TYPE);
        return humanResource;
    }

    @BeforeEach
    public void initTest() {
        humanResource = createEntity(em);
    }

    @Test
    @Transactional
    void createHumanResource() throws Exception {
        int databaseSizeBeforeCreate = humanResourceRepository.findAll().size();
        // Create the HumanResource
        restHumanResourceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(humanResource))
            )
            .andExpect(status().isCreated());

        // Validate the HumanResource in the database
        List<HumanResource> humanResourceList = humanResourceRepository.findAll();
        assertThat(humanResourceList).hasSize(databaseSizeBeforeCreate + 1);
        HumanResource testHumanResource = humanResourceList.get(humanResourceList.size() - 1);
        assertThat(testHumanResource.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testHumanResource.getAbbr()).isEqualTo(DEFAULT_ABBR);
        assertThat(testHumanResource.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testHumanResource.getBirthday()).isEqualTo(DEFAULT_BIRTHDAY);
        assertThat(testHumanResource.getGender()).isEqualTo(DEFAULT_GENDER);
        assertThat(testHumanResource.getPhone()).isEqualTo(DEFAULT_PHONE);
        assertThat(testHumanResource.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testHumanResource.getSsn()).isEqualTo(DEFAULT_SSN);
        assertThat(testHumanResource.getBannking()).isEqualTo(DEFAULT_BANNKING);
        assertThat(testHumanResource.getRelationshipType()).isEqualTo(DEFAULT_RELATIONSHIP_TYPE);
    }

    @Test
    @Transactional
    void createHumanResourceWithExistingId() throws Exception {
        // Create the HumanResource with an existing ID
        humanResource.setId(1L);

        int databaseSizeBeforeCreate = humanResourceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restHumanResourceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(humanResource))
            )
            .andExpect(status().isBadRequest());

        // Validate the HumanResource in the database
        List<HumanResource> humanResourceList = humanResourceRepository.findAll();
        assertThat(humanResourceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkAbbrIsRequired() throws Exception {
        int databaseSizeBeforeTest = humanResourceRepository.findAll().size();
        // set the field null
        humanResource.setAbbr(null);

        // Create the HumanResource, which fails.

        restHumanResourceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(humanResource))
            )
            .andExpect(status().isBadRequest());

        List<HumanResource> humanResourceList = humanResourceRepository.findAll();
        assertThat(humanResourceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = humanResourceRepository.findAll().size();
        // set the field null
        humanResource.setName(null);

        // Create the HumanResource, which fails.

        restHumanResourceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(humanResource))
            )
            .andExpect(status().isBadRequest());

        List<HumanResource> humanResourceList = humanResourceRepository.findAll();
        assertThat(humanResourceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkBirthdayIsRequired() throws Exception {
        int databaseSizeBeforeTest = humanResourceRepository.findAll().size();
        // set the field null
        humanResource.setBirthday(null);

        // Create the HumanResource, which fails.

        restHumanResourceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(humanResource))
            )
            .andExpect(status().isBadRequest());

        List<HumanResource> humanResourceList = humanResourceRepository.findAll();
        assertThat(humanResourceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkGenderIsRequired() throws Exception {
        int databaseSizeBeforeTest = humanResourceRepository.findAll().size();
        // set the field null
        humanResource.setGender(null);

        // Create the HumanResource, which fails.

        restHumanResourceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(humanResource))
            )
            .andExpect(status().isBadRequest());

        List<HumanResource> humanResourceList = humanResourceRepository.findAll();
        assertThat(humanResourceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllHumanResources() throws Exception {
        // Initialize the database
        humanResourceRepository.saveAndFlush(humanResource);

        // Get all the humanResourceList
        restHumanResourceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(humanResource.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].abbr").value(hasItem(DEFAULT_ABBR)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].birthday").value(hasItem(DEFAULT_BIRTHDAY.toString())))
            .andExpect(jsonPath("$.[*].gender").value(hasItem(DEFAULT_GENDER.toString())))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].ssn").value(hasItem(DEFAULT_SSN)))
            .andExpect(jsonPath("$.[*].bannking").value(hasItem(DEFAULT_BANNKING)))
            .andExpect(jsonPath("$.[*].relationshipType").value(hasItem(DEFAULT_RELATIONSHIP_TYPE)));
    }

    @Test
    @Transactional
    void getHumanResource() throws Exception {
        // Initialize the database
        humanResourceRepository.saveAndFlush(humanResource);

        // Get the humanResource
        restHumanResourceMockMvc
            .perform(get(ENTITY_API_URL_ID, humanResource.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(humanResource.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.abbr").value(DEFAULT_ABBR))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.birthday").value(DEFAULT_BIRTHDAY.toString()))
            .andExpect(jsonPath("$.gender").value(DEFAULT_GENDER.toString()))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.ssn").value(DEFAULT_SSN))
            .andExpect(jsonPath("$.bannking").value(DEFAULT_BANNKING))
            .andExpect(jsonPath("$.relationshipType").value(DEFAULT_RELATIONSHIP_TYPE));
    }

    @Test
    @Transactional
    void getNonExistingHumanResource() throws Exception {
        // Get the humanResource
        restHumanResourceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingHumanResource() throws Exception {
        // Initialize the database
        humanResourceRepository.saveAndFlush(humanResource);

        int databaseSizeBeforeUpdate = humanResourceRepository.findAll().size();

        // Update the humanResource
        HumanResource updatedHumanResource = humanResourceRepository.findById(humanResource.getId()).get();
        // Disconnect from session so that the updates on updatedHumanResource are not directly saved in db
        em.detach(updatedHumanResource);
        updatedHumanResource
            .type(UPDATED_TYPE)
            .abbr(UPDATED_ABBR)
            .name(UPDATED_NAME)
            .birthday(UPDATED_BIRTHDAY)
            .gender(UPDATED_GENDER)
            .phone(UPDATED_PHONE)
            .email(UPDATED_EMAIL)
            .ssn(UPDATED_SSN)
            .bannking(UPDATED_BANNKING)
            .relationshipType(UPDATED_RELATIONSHIP_TYPE);

        restHumanResourceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedHumanResource.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedHumanResource))
            )
            .andExpect(status().isOk());

        // Validate the HumanResource in the database
        List<HumanResource> humanResourceList = humanResourceRepository.findAll();
        assertThat(humanResourceList).hasSize(databaseSizeBeforeUpdate);
        HumanResource testHumanResource = humanResourceList.get(humanResourceList.size() - 1);
        assertThat(testHumanResource.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testHumanResource.getAbbr()).isEqualTo(UPDATED_ABBR);
        assertThat(testHumanResource.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testHumanResource.getBirthday()).isEqualTo(UPDATED_BIRTHDAY);
        assertThat(testHumanResource.getGender()).isEqualTo(UPDATED_GENDER);
        assertThat(testHumanResource.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testHumanResource.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testHumanResource.getSsn()).isEqualTo(UPDATED_SSN);
        assertThat(testHumanResource.getBannking()).isEqualTo(UPDATED_BANNKING);
        assertThat(testHumanResource.getRelationshipType()).isEqualTo(UPDATED_RELATIONSHIP_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingHumanResource() throws Exception {
        int databaseSizeBeforeUpdate = humanResourceRepository.findAll().size();
        humanResource.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHumanResourceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, humanResource.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(humanResource))
            )
            .andExpect(status().isBadRequest());

        // Validate the HumanResource in the database
        List<HumanResource> humanResourceList = humanResourceRepository.findAll();
        assertThat(humanResourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchHumanResource() throws Exception {
        int databaseSizeBeforeUpdate = humanResourceRepository.findAll().size();
        humanResource.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHumanResourceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(humanResource))
            )
            .andExpect(status().isBadRequest());

        // Validate the HumanResource in the database
        List<HumanResource> humanResourceList = humanResourceRepository.findAll();
        assertThat(humanResourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamHumanResource() throws Exception {
        int databaseSizeBeforeUpdate = humanResourceRepository.findAll().size();
        humanResource.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHumanResourceMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(humanResource))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the HumanResource in the database
        List<HumanResource> humanResourceList = humanResourceRepository.findAll();
        assertThat(humanResourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateHumanResourceWithPatch() throws Exception {
        // Initialize the database
        humanResourceRepository.saveAndFlush(humanResource);

        int databaseSizeBeforeUpdate = humanResourceRepository.findAll().size();

        // Update the humanResource using partial update
        HumanResource partialUpdatedHumanResource = new HumanResource();
        partialUpdatedHumanResource.setId(humanResource.getId());

        partialUpdatedHumanResource
            .type(UPDATED_TYPE)
            .name(UPDATED_NAME)
            .gender(UPDATED_GENDER)
            .bannking(UPDATED_BANNKING)
            .relationshipType(UPDATED_RELATIONSHIP_TYPE);

        restHumanResourceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHumanResource.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHumanResource))
            )
            .andExpect(status().isOk());

        // Validate the HumanResource in the database
        List<HumanResource> humanResourceList = humanResourceRepository.findAll();
        assertThat(humanResourceList).hasSize(databaseSizeBeforeUpdate);
        HumanResource testHumanResource = humanResourceList.get(humanResourceList.size() - 1);
        assertThat(testHumanResource.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testHumanResource.getAbbr()).isEqualTo(DEFAULT_ABBR);
        assertThat(testHumanResource.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testHumanResource.getBirthday()).isEqualTo(DEFAULT_BIRTHDAY);
        assertThat(testHumanResource.getGender()).isEqualTo(UPDATED_GENDER);
        assertThat(testHumanResource.getPhone()).isEqualTo(DEFAULT_PHONE);
        assertThat(testHumanResource.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testHumanResource.getSsn()).isEqualTo(DEFAULT_SSN);
        assertThat(testHumanResource.getBannking()).isEqualTo(UPDATED_BANNKING);
        assertThat(testHumanResource.getRelationshipType()).isEqualTo(UPDATED_RELATIONSHIP_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateHumanResourceWithPatch() throws Exception {
        // Initialize the database
        humanResourceRepository.saveAndFlush(humanResource);

        int databaseSizeBeforeUpdate = humanResourceRepository.findAll().size();

        // Update the humanResource using partial update
        HumanResource partialUpdatedHumanResource = new HumanResource();
        partialUpdatedHumanResource.setId(humanResource.getId());

        partialUpdatedHumanResource
            .type(UPDATED_TYPE)
            .abbr(UPDATED_ABBR)
            .name(UPDATED_NAME)
            .birthday(UPDATED_BIRTHDAY)
            .gender(UPDATED_GENDER)
            .phone(UPDATED_PHONE)
            .email(UPDATED_EMAIL)
            .ssn(UPDATED_SSN)
            .bannking(UPDATED_BANNKING)
            .relationshipType(UPDATED_RELATIONSHIP_TYPE);

        restHumanResourceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHumanResource.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHumanResource))
            )
            .andExpect(status().isOk());

        // Validate the HumanResource in the database
        List<HumanResource> humanResourceList = humanResourceRepository.findAll();
        assertThat(humanResourceList).hasSize(databaseSizeBeforeUpdate);
        HumanResource testHumanResource = humanResourceList.get(humanResourceList.size() - 1);
        assertThat(testHumanResource.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testHumanResource.getAbbr()).isEqualTo(UPDATED_ABBR);
        assertThat(testHumanResource.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testHumanResource.getBirthday()).isEqualTo(UPDATED_BIRTHDAY);
        assertThat(testHumanResource.getGender()).isEqualTo(UPDATED_GENDER);
        assertThat(testHumanResource.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testHumanResource.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testHumanResource.getSsn()).isEqualTo(UPDATED_SSN);
        assertThat(testHumanResource.getBannking()).isEqualTo(UPDATED_BANNKING);
        assertThat(testHumanResource.getRelationshipType()).isEqualTo(UPDATED_RELATIONSHIP_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingHumanResource() throws Exception {
        int databaseSizeBeforeUpdate = humanResourceRepository.findAll().size();
        humanResource.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHumanResourceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, humanResource.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(humanResource))
            )
            .andExpect(status().isBadRequest());

        // Validate the HumanResource in the database
        List<HumanResource> humanResourceList = humanResourceRepository.findAll();
        assertThat(humanResourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchHumanResource() throws Exception {
        int databaseSizeBeforeUpdate = humanResourceRepository.findAll().size();
        humanResource.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHumanResourceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(humanResource))
            )
            .andExpect(status().isBadRequest());

        // Validate the HumanResource in the database
        List<HumanResource> humanResourceList = humanResourceRepository.findAll();
        assertThat(humanResourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamHumanResource() throws Exception {
        int databaseSizeBeforeUpdate = humanResourceRepository.findAll().size();
        humanResource.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHumanResourceMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(humanResource))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the HumanResource in the database
        List<HumanResource> humanResourceList = humanResourceRepository.findAll();
        assertThat(humanResourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteHumanResource() throws Exception {
        // Initialize the database
        humanResourceRepository.saveAndFlush(humanResource);

        int databaseSizeBeforeDelete = humanResourceRepository.findAll().size();

        // Delete the humanResource
        restHumanResourceMockMvc
            .perform(delete(ENTITY_API_URL_ID, humanResource.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<HumanResource> humanResourceList = humanResourceRepository.findAll();
        assertThat(humanResourceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
