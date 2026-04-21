-- =============================================================================
-- SCRIPT PARA ATUALIZAR TODAS AS BANDEIRAS PARA CAMINHOS LOCAIS
-- Executar no SQL Editor do Supabase Dashboard
-- =============================================================================

-- Ver quantas perguntas de bandeiras existem antes
SELECT 'Perguntas de bandeiras antes:', COUNT(*) 
FROM questions 
WHERE category = 'Bandeiras' OR category LIKE '%Bandeira%' OR category LIKE '%bandeira%';

-- Atualizar perguntas que têm URLs do flagcdn.com para caminhos locais
UPDATE questions 
SET image_url = 
    CASE
        -- Europa
        WHEN image_url LIKE '%/pt.svg' THEN '/flags/pt.svg'
        WHEN image_url LIKE '%/es.svg' THEN '/flags/es.svg'
        WHEN image_url LIKE '%/fr.svg' THEN '/flags/fr.svg'
        WHEN image_url LIKE '%/de.svg' THEN '/flags/de.svg'
        WHEN image_url LIKE '%/it.svg' THEN '/flags/it.svg'
        WHEN image_url LIKE '%/gb.svg' THEN '/flags/gb.svg'
        WHEN image_url LIKE '%/nl.svg' THEN '/flags/nl.svg'
        WHEN image_url LIKE '%/be.svg' THEN '/flags/be.svg'
        WHEN image_url LIKE '%/ch.svg' THEN '/flags/ch.svg'
        WHEN image_url LIKE '%/at.svg' THEN '/flags/at.svg'
        WHEN image_url LIKE '%/gr.svg' THEN '/flags/gr.svg'
        WHEN image_url LIKE '%/se.svg' THEN '/flags/se.svg'
        WHEN image_url LIKE '%/no.svg' THEN '/flags/no.svg'
        WHEN image_url LIKE '%/dk.svg' THEN '/flags/dk.svg'
        WHEN image_url LIKE '%/fi.svg' THEN '/flags/fi.svg'
        WHEN image_url LIKE '%/ie.svg' THEN '/flags/ie.svg'
        WHEN image_url LIKE '%/pl.svg' THEN '/flags/pl.svg'
        WHEN image_url LIKE '%/ua.svg' THEN '/flags/ua.svg'
        WHEN image_url LIKE '%/cz.svg' THEN '/flags/cz.svg'
        WHEN image_url LIKE '%/hu.svg' THEN '/flags/hu.svg'
        WHEN image_url LIKE '%/ro.svg' THEN '/flags/ro.svg'
        WHEN image_url LIKE '%/bg.svg' THEN '/flags/bg.svg'
        WHEN image_url LIKE '%/rs.svg' THEN '/flags/rs.svg'
        WHEN image_url LIKE '%/hr.svg' THEN '/flags/hr.svg'
        WHEN image_url LIKE '%/si.svg' THEN '/flags/si.svg'
        WHEN image_url LIKE '%/sk.svg' THEN '/flags/sk.svg'
        WHEN image_url LIKE '%/ee.svg' THEN '/flags/ee.svg'
        WHEN image_url LIKE '%/lv.svg' THEN '/flags/lv.svg'
        WHEN image_url LIKE '%/lt.svg' THEN '/flags/lt.svg'
        WHEN image_url LIKE '%/mt.svg' THEN '/flags/mt.svg'
        WHEN image_url LIKE '%/cy.svg' THEN '/flags/cy.svg'
        WHEN image_url LIKE '%/is.svg' THEN '/flags/is.svg'
        -- América do Sul
        WHEN image_url LIKE '%/br.svg' THEN '/flags/br.svg'
        WHEN image_url LIKE '%/ar.svg' THEN '/flags/ar.svg'
        WHEN image_url LIKE '%/cl.svg' THEN '/flags/cl.svg'
        WHEN image_url LIKE '%/co.svg' THEN '/flags/co.svg'
        WHEN image_url LIKE '%/pe.svg' THEN '/flags/pe.svg'
        WHEN image_url LIKE '%/ve.svg' THEN '/flags/ve.svg'
        WHEN image_url LIKE '%/ec.svg' THEN '/flags/ec.svg'
        WHEN image_url LIKE '%/bo.svg' THEN '/flags/bo.svg'
        WHEN image_url LIKE '%/uy.svg' THEN '/flags/uy.svg'
        WHEN image_url LIKE '%/py.svg' THEN '/flags/py.svg'
        -- América do Norte/Central
        WHEN image_url LIKE '%/us.svg' THEN '/flags/us.svg'
        WHEN image_url LIKE '%/mx.svg' THEN '/flags/mx.svg'
        WHEN image_url LIKE '%/ca.svg' THEN '/flags/ca.svg'
        WHEN image_url LIKE '%/cu.svg' THEN '/flags/cu.svg'
        WHEN image_url LIKE '%/jm.svg' THEN '/flags/jm.svg'
        WHEN image_url LIKE '%/cr.svg' THEN '/flags/cr.svg'
        WHEN image_url LIKE '%/pa.svg' THEN '/flags/pa.svg'
        WHEN image_url LIKE '%/gt.svg' THEN '/flags/gt.svg'
        -- Ásia
        WHEN image_url LIKE '%/jp.svg' THEN '/flags/jp.svg'
        WHEN image_url LIKE '%/cn.svg' THEN '/flags/cn.svg'
        WHEN image_url LIKE '%/kr.svg' THEN '/flags/kr.svg'
        WHEN image_url LIKE '%/in.svg' THEN '/flags/in.svg'
        WHEN image_url LIKE '%/au.svg' THEN '/flags/au.svg'
        WHEN image_url LIKE '%/th.svg' THEN '/flags/th.svg'
        WHEN image_url LIKE '%/vn.svg' THEN '/flags/vn.svg'
        WHEN image_url LIKE '%/id.svg' THEN '/flags/id.svg'
        WHEN image_url LIKE '%/ph.svg' THEN '/flags/ph.svg'
        WHEN image_url LIKE '%/sg.svg' THEN '/flags/sg.svg'
        WHEN image_url LIKE '%/my.svg' THEN '/flags/my.svg'
        WHEN image_url LIKE '%/mm.svg' THEN '/flags/mm.svg'
        WHEN image_url LIKE '%/bd.svg' THEN '/flags/bd.svg'
        WHEN image_url LIKE '%/pk.svg' THEN '/flags/pk.svg'
        WHEN image_url LIKE '%/af.svg' THEN '/flags/af.svg'
        WHEN image_url LIKE '%/ru.svg' THEN '/flags/ru.svg'
        WHEN image_url LIKE '%/tr.svg' THEN '/flags/tr.svg'
        WHEN image_url LIKE '%/ae.svg' THEN '/flags/ae.svg'
        WHEN image_url LIKE '%/sa.svg' THEN '/flags/sa.svg'
        WHEN image_url LIKE '%/il.svg' THEN '/flags/il.svg'
        WHEN image_url LIKE '%/ir.svg' THEN '/flags/ir.svg'
        WHEN image_url LIKE '%/iq.svg' THEN '/flags/iq.svg'
        WHEN image_url LIKE '%/tw.svg' THEN '/flags/tw.svg'
        WHEN image_url LIKE '%/kz.svg' THEN '/flags/kz.svg'
        WHEN image_url LIKE '%/by.svg' THEN '/flags/by.svg'
        -- África
        WHEN image_url LIKE '%/eg.svg' THEN '/flags/eg.svg'
        WHEN image_url LIKE '%/za.svg' THEN '/flags/za.svg'
        WHEN image_url LIKE '%/ma.svg' THEN '/flags/ma.svg'
        WHEN image_url LIKE '%/ng.svg' THEN '/flags/ng.svg'
        WHEN image_url LIKE '%/ke.svg' THEN '/flags/ke.svg'
        WHEN image_url LIKE '%/gh.svg' THEN '/flags/gh.svg'
        WHEN image_url LIKE '%/tz.svg' THEN '/flags/tz.svg'
        WHEN image_url LIKE '%/tn.svg' THEN '/flags/tn.svg'
        WHEN image_url LIKE '%/dz.svg' THEN '/flags/dz.svg'
        WHEN image_url LIKE '%/et.svg' THEN '/flags/et.svg'
        -- Oceania
        WHEN image_url LIKE '%/nz.svg' THEN '/flags/nz.svg'
        WHEN image_url LIKE '%/fj.svg' THEN '/flags/fj.svg'
        WHEN image_url LIKE '%/pg.svg' THEN '/flags/pg.svg'
        -- Se já for caminho local, mantém
        ELSE image_url
    END
WHERE (category = 'Bandeiras' OR category LIKE '%Bandeira%' OR category LIKE '%bandeira%')
AND image_url IS NOT NULL
AND image_url != '';

-- Ver quantas perguntas foram atualizadas
SELECT 'Perguntas atualizadas:', COUNT(*) 
FROM questions 
WHERE image_url LIKE '/flags/%';
